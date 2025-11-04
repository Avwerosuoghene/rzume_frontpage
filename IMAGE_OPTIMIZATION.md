# Image Optimization Guide

This guide explains how to optimize images for faster loading times in your Angular application.

## 🚨 Current Image Issues

Your images are currently very large and causing slow load times:

- `food_platter.jpg`: **3.6MB** (should be ~200KB)
- `professional-woman.jpg`: **2.5MB** (should be ~150KB)
- `smiling-lady.jpg`: **963KB** (should be ~100KB)
- `boy_on_laptop.jpg`: **317KB** (should be ~80KB)

## 🛠️ Optimization Tools

### Option 1: Automated Script (Recommended)
```bash
# Run the optimization script
./scripts/optimize-images.sh
```

### Option 2: Manual Optimization

#### Install ImageMagick (macOS)
```bash
brew install imagemagick
```

#### Install WebP tools
```bash
brew install webp
```

#### Optimize Individual Images
```bash
# Resize and compress JPEG
convert input.jpg -quality 75 -resize 1200x> -strip output.jpg

# Create WebP version
cwebp -q 75 input.jpg -o output.webp
```

## 📱 Responsive Images

Create multiple sizes for different devices:

```bash
# Mobile (400px width)
convert input.jpg -quality 75 -resize 400x> -strip input-mobile.jpg
cwebp -q 75 input-mobile.jpg -o input-mobile.webp

# Tablet (800px width)
convert input.jpg -quality 75 -resize 800x> -strip input-tablet.jpg
cwebp -q 75 input-tablet.jpg -o input-tablet.webp

# Desktop (1200px width)
convert input.jpg -quality 75 -resize 1200x> -strip input-desktop.jpg
cwebp -q 75 input-desktop.jpg -o input-desktop.webp
```

## 🚀 Implementation Features

### 1. Lazy Loading
- Images load only when they enter the viewport
- Reduces initial page load time
- Uses Intersection Observer API

### 2. WebP Support
- Modern format with 25-35% better compression
- Automatic fallback to JPEG for older browsers
- Browser support detection

### 3. Optimized Image Component
```html
<app-optimized-image 
  src="/assets/images/example.jpg"
  alt="Description"
  [lazy]="true"
  [responsive]="true">
</app-optimized-image>
```

### 4. Background Image Lazy Loading
- CTA section background loads when scrolled into view
- Shows loading spinner while image loads
- Graceful fallback handling

## 📊 Expected Performance Improvements

### Before Optimization:
- Total image size: **~7.5MB**
- First Contentful Paint: **3-5 seconds**
- Largest Contentful Paint: **5-8 seconds**

### After Optimization:
- Total image size: **~600KB** (92% reduction)
- First Contentful Paint: **0.5-1 second**
- Largest Contentful Paint: **1-2 seconds**

## 🔧 Quick Start

1. **Run the optimization script:**
   ```bash
   chmod +x scripts/optimize-images.sh
   ./scripts/optimize-images.sh
   ```

2. **Update image paths in your components:**
   ```typescript
   // Change from:
   backgroundImage: url('/assets/images/smiling-lady.jpg')
   
   // To:
   backgroundImage: url('/assets/images/optimized/smiling-lady.webp')
   ```

3. **Use the OptimizedImageComponent:**
   ```html
   <app-optimized-image 
     src="/assets/images/optimized/example.jpg"
     alt="Example image"
     [lazy]="true">
   </app-optimized-image>
   ```

## 🎯 Best Practices

### Image Quality Settings:
- **Photos**: 75-85% JPEG quality
- **Graphics**: PNG or SVG
- **WebP**: 75-80% quality

### Size Guidelines:
- **Hero images**: Max 1200px width, <200KB
- **Content images**: Max 800px width, <100KB
- **Thumbnails**: Max 400px width, <50KB

### Loading Strategy:
- **Above-the-fold**: Eager loading
- **Below-the-fold**: Lazy loading
- **Background images**: Intersection Observer

## 📈 Monitoring

Use browser DevTools to monitor:
- Network tab for image load times
- Lighthouse for performance scores
- Core Web Vitals metrics

## 🔄 Deployment

The optimized images will be automatically included in your Docker build and deployed to Google Cloud Run.

Make sure to update any hardcoded image paths to use the optimized versions.
