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
COPY --from=build /app/dist/rzume_frontpage/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 to comply with Cloud Run requirements
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
