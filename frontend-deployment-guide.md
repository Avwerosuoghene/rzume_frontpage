# Frontend Deployment Guide: Angular on Google Cloud Run

This document provides a comprehensive guide for dockerizing and deploying the frontend Angular application to Google Cloud Run, complete with a CI/CD pipeline using GitHub Actions.

## Table of Contents

1.  [Core Concepts](#1-core-concepts)
2.  [Step 1: Dockerizing the Angular Application](#2-step-1-dockerizing-the-angular-application)
3.  [Step 2: Dynamic Configuration](#3-step-2-dynamic-configuration)
4.  [Step 3: CI/CD Pipeline Setup](#4-step-3-cicd-pipeline-setup)

## 1. Core Concepts: Dynamic Configuration

To make the frontend deployable to any environment, we must avoid hardcoding configuration like API URLs. The strategy is to generate the `config.json` file when the Docker container starts, using environment variables.

- **`Dockerfile`**: A multi-stage build that compiles the Angular app and sets up an Nginx server.
- **`nginx.conf`**: A configuration for Nginx to serve the static files and handle routing.
- **`config.template.json`**: A template for your configuration file with placeholders for environment variables.
- **`entrypoint.sh`**: A script that runs on container startup to create the final `config.json` from the template and then starts Nginx.

---

## 2. Step 1: Dockerizing the Angular Application

Create the following four files in the root directory of your Angular project.

### A. `Dockerfile`

This file defines the build and runtime stages for the container.

```dockerfile
# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build -- --configuration production

# Stage 2: Serve the application from Nginx
FROM nginx:1.25-alpine

# Copy the built application from the 'build' stage
COPY --from=build /app/dist/rzume-client/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the config template and entrypoint script
COPY config.template.json /usr/share/nginx/html/assets/config.template.json
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose port 8080 to comply with Cloud Run requirements
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
```

### B. `nginx.conf`

This configures Nginx to serve the Angular app and correctly handle single-page application (SPA) routing.

```nginx
server {
    listen 8080;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Add headers to prevent caching of index.html
    location = /index.html {
        add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        expires off;
    }
}
```

### C. `config.template.json`

Create this file inside your `src/assets` directory. It's a template of your `config.json` with placeholders.

```json
{
  "apiUrls": {
    "backend": "${BACKEND_API_URL}",
    "googleAuth": "${GOOGLE_AUTH_CLIENT_ID}"
  },
  "featureFlags": {
    "enableProfileManagement": ${ENABLE_PROFILE_MANAGEMENT}
  }
}
```

### D. `entrypoint.sh`

This script is the heart of the dynamic configuration. It runs on container startup.

```sh
#!/bin/sh

# Define the path to the template and the final config file
TEMPLATE_FILE="/usr/share/nginx/html/assets/config.template.json"
CONFIG_FILE="/usr/share/nginx/html/assets/config.json"

# Use envsubst to replace environment variables in the template and create the final config
# The '$$' syntax is used to avoid shell expansion of the variables in the command itself.
# We list the variables explicitly to avoid substituting other unintended variables.
envsubst '\$BACKEND_API_URL,\$GOOGLE_AUTH_CLIENT_ID,\$ENABLE_PROFILE_MANAGEMENT' < "$TEMPLATE_FILE" > "$CONFIG_FILE"

# Optional: Output the generated config for debugging
echo "Generated config.json:"
cat "$CONFIG_FILE"

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'
```

---

## 3. Step 3: CI/CD Pipeline Setup

This GitHub Actions workflow will automate the deployment of your Angular application. Create a new file at `.github/workflows/deploy-frontend.yml`.

**Note:** This pipeline assumes your frontend code is in a directory named `rzume-client` at the root of your repository. If it's located elsewhere, you must adjust the `working-directory` path in the workflow file.

### A. `deploy-frontend.yml`

```yaml
name: Deploy Frontend to Google Cloud Run

on:
  push:
    branches:
      - master
    paths:
      - 'rzume-client/**' # Only run when frontend code changes

env:
  GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  GCP_REGION: africa-south1
  SERVICE_NAME: rzume-client
  REPOSITORY_NAME: rzume-client-images # A new repository for the frontend images

jobs:
  build-and-deploy-frontend:
    name: Build and Deploy Frontend
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: "Set up Cloud SDK"
        uses: "google-github-actions/setup-gcloud@v1"

      - name: Configure Docker
        run: gcloud auth configure-docker ${{ env.GCP_REGION }}-docker.pkg.dev

      - name: Build and Push Docker Image
        run: |
          docker build -t ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/${{ env.SERVICE_NAME }}:${{ github.sha }} .
          docker push ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/${{ env.SERVICE_NAME }}:${{ github.sha }}
        working-directory: ./rzume-client # Specify the frontend directory

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/${{ env.REPOSITORY_NAME }}/${{ env.SERVICE_NAME }}:${{ github.sha }} \
            --region ${{ env.GCP_REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --set-env-vars="BACKEND_API_URL=${{ secrets.PROD_BACKEND_API_URL }},GOOGLE_AUTH_CLIENT_ID=${{ secrets.PROD_GOOGLE_AUTH_CLIENT_ID }},ENABLE_PROFILE_MANAGEMENT=false"
```

### B. Required Setup

1.  **Create a New Artifact Registry:** In your Google Cloud project, create a new Docker repository named `rzume-client-images` (or the name you chose in the `env` section).

2.  **Add New GitHub Secrets:** You need to add the production values for your frontend configuration to your repository's secrets (**Settings > Secrets and variables > Actions**):
    -   `PROD_BACKEND_API_URL`: The full URL of your deployed backend API (e.g., `https://rzume-api-....run.app`).
    -   `PROD_GOOGLE_AUTH_CLIENT_ID`: The Google Auth Client ID for your frontend.

Once these steps are complete, pushing a change to your frontend's directory will trigger the pipeline and deploy the application.
