#!/bin/bash

# Image Optimization Script
# This script optimizes images for web use

IMAGES_DIR="public/assets/images"
OPTIMIZED_DIR="public/assets/images/optimized"

# Create optimized directory if it doesn't exist
mkdir -p "$OPTIMIZED_DIR"

echo "🖼️  Starting image optimization..."

# Function to optimize JPEG images
optimize_jpeg() {
    local input="$1"
    local output="$2"
    local quality="$3"
    local width="$4"
    
    if command -v cjpeg >/dev/null 2>&1; then
        # Using mozjpeg for better compression
        djpeg "$input" | cjpeg -quality "$quality" -optimize -progressive > "$output"
    elif command -v convert >/dev/null 2>&1; then
        # Using ImageMagick
        convert "$input" -quality "$quality" -resize "${width}x>" -strip "$output"
    else
        echo "⚠️  No image optimization tools found. Please install ImageMagick or mozjpeg"
        cp "$input" "$output"
    fi
}

# Function to create WebP versions
create_webp() {
    local input="$1"
    local output="$2"
    local quality="$3"
    
    if command -v cwebp >/dev/null 2>&1; then
        cwebp -q "$quality" "$input" -o "$output"
    else
        echo "⚠️  WebP tools not found. Skipping WebP creation for $input"
    fi
}

# Optimize large images
echo "📸 Optimizing food_platter.jpg (3.6MB -> ~200KB)"
optimize_jpeg "$IMAGES_DIR/food_platter.jpg" "$OPTIMIZED_DIR/food_platter.jpg" 75 1200
create_webp "$OPTIMIZED_DIR/food_platter.jpg" "$OPTIMIZED_DIR/food_platter.webp" 75

echo "👩 Optimizing professional-woman.jpg (2.5MB -> ~150KB)"
optimize_jpeg "$IMAGES_DIR/professional-woman.jpg" "$OPTIMIZED_DIR/professional-woman.jpg" 80 1000
create_webp "$OPTIMIZED_DIR/professional-woman.jpg" "$OPTIMIZED_DIR/professional-woman.webp" 80

echo "😊 Optimizing smiling-lady.jpg (963KB -> ~100KB)"
optimize_jpeg "$IMAGES_DIR/smiling-lady.jpg" "$OPTIMIZED_DIR/smiling-lady.jpg" 80 800
create_webp "$OPTIMIZED_DIR/smiling-lady.jpg" "$OPTIMIZED_DIR/smiling-lady.webp" 80

echo "👨‍💻 Optimizing boy_on_laptop.jpg (317KB -> ~80KB)"
optimize_jpeg "$IMAGES_DIR/boy_on_laptop.jpg" "$OPTIMIZED_DIR/boy_on_laptop.jpg" 75 600
create_webp "$OPTIMIZED_DIR/boy_on_laptop.jpg" "$OPTIMIZED_DIR/boy_on_laptop.webp" 75

# Optimize blog post images
for i in {1..3}; do
    echo "📝 Optimizing blog-post${i}.jpg"
    optimize_jpeg "$IMAGES_DIR/blog-post${i}.jpg" "$OPTIMIZED_DIR/blog-post${i}.jpg" 75 400
    create_webp "$OPTIMIZED_DIR/blog-post${i}.jpg" "$OPTIMIZED_DIR/blog-post${i}.webp" 75
done

echo "✅ Image optimization complete!"
echo "📊 Check the optimized directory: $OPTIMIZED_DIR"

# Show size comparison
echo ""
echo "📈 Size comparison:"
du -h "$IMAGES_DIR"/*.jpg | sort -hr
echo "---"
du -h "$OPTIMIZED_DIR"/*.jpg 2>/dev/null | sort -hr || echo "No optimized images found"
