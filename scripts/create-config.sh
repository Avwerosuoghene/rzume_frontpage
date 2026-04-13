#!/bin/bash

# Create production config.json from environment variables
# Must be in public/ directory to be copied by Angular build
mkdir -p public/assets/config

cat > public/assets/config/config.json << EOF
{
  "analytics": {
    "googleTagId": "${GOOGLE_TAG_ID}",
    "linkedInPartnerId": "${LINKEDIN_PARTNER_ID:-}",
    "mixpanelToken": "${MIXPANEL_TOKEN:-}",
    "enabled": ${ANALYTICS_ENABLED:-true},
    "debug": ${ANALYTICS_DEBUG:-false}
  }
}
EOF

echo "Production config.json created successfully at public/assets/config/config.json"
