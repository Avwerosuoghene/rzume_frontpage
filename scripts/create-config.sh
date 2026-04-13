#!/bin/bash

# Create production config.json from environment variables
cat > src/assets/config/config.json << EOF
{
  "analytics": {
    "googleTagId": "${GOOGLE_TAG_ID}",
    "enabled": ${ANALYTICS_ENABLED:-true},
    "debug": ${ANALYTICS_DEBUG:-false}
  }
}
EOF

echo "Production config.json created successfully"
