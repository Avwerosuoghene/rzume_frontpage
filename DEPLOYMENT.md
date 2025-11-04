# Deployment Guide

This Angular application is configured for deployment to Google Cloud Run.

## Files Overview

- **Dockerfile**: Multi-stage build that compiles the Angular app and serves it with Nginx
- **nginx.conf**: Nginx configuration for serving the SPA and handling routing
- **.github/workflows/deploy-frontend.yml**: CI/CD pipeline for automatic deployment
- **.dockerignore**: Excludes unnecessary files from Docker build context

## Prerequisites

1. **Google Cloud Project**: Set up a GCP project with billing enabled
2. **Artifact Registry**: Create a Docker repository named `rzume-frontpage`
3. **GitHub Secrets**: Add the following secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `GCP_SERVICE_ACCOUNT_KEY`: Service account JSON key with necessary permissions

## Service Account Permissions

Your service account needs the following roles:
- Cloud Run Admin
- Artifact Registry Writer
- Storage Admin (if using Cloud Storage)

## Local Testing

To test the Docker build locally:

```bash
# Build the Docker image
docker build -t rzume-frontpage .

# Run the container
docker run -p 8080:8080 rzume-frontpage
```

The application will be available at `http://localhost:8080`

## Deployment

The application automatically deploys when you push to the `main` or `master` branch. The CI/CD pipeline will:

1. Build the Docker image
2. Push it to Google Artifact Registry
3. Deploy to Cloud Run
4. Make the service publicly accessible

## Manual Deployment

If you need to deploy manually:

```bash
# Build and tag the image
docker build -t gcr.io/YOUR_PROJECT_ID/rzume-frontpage .

# Push to Artifact Registry
docker push gcr.io/YOUR_PROJECT_ID/rzume-frontpage

# Deploy to Cloud Run
gcloud run deploy rzume-frontpage \
  --image gcr.io/YOUR_PROJECT_ID/rzume-frontpage \
  --region africa-south1 \
  --platform managed \
  --allow-unauthenticated
```

## Configuration

The application is currently configured as a static frontend without dynamic configuration. All settings are built into the application at build time.
