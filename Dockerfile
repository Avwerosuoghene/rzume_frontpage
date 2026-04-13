# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Build arguments from GitHub Actions
ARG GOOGLE_TAG_ID
ARG LINKEDIN_PARTNER_ID
ARG MIXPANEL_TOKEN
ARG ANALYTICS_ENABLED=true
ARG ANALYTICS_DEBUG=false

# Set environment variables for script
ENV GOOGLE_TAG_ID=${GOOGLE_TAG_ID}
ENV LINKEDIN_PARTNER_ID=${LINKEDIN_PARTNER_ID}
ENV MIXPANEL_TOKEN=${MIXPANEL_TOKEN}
ENV ANALYTICS_ENABLED=${ANALYTICS_ENABLED}
ENV ANALYTICS_DEBUG=${ANALYTICS_DEBUG}

# Install bash for script execution
RUN apk add --no-cache bash dos2unix

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy and run config generation script
COPY scripts/create-config.sh ./create-config.sh
RUN dos2unix /app/create-config.sh \
  && chmod +x /app/create-config.sh \
  && /app/create-config.sh

# Build the application for production
RUN npm run build -- --configuration production

# Stage 2: Serve the application from Nginx
FROM nginx:1.25-alpine

# Copy the built application from the 'build' stage
COPY --from=build /app/dist/rzume_frontpage/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 to comply with Cloud Run requirements
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
