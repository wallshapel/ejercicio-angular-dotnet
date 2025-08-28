#!/bin/sh
set -e

#  Default value if not provided by env
: "${API_BASE_URL:=http://localhost:8080}"

# Secure assets folder
mkdir -p /usr/share/nginx/html/assets

cat > /usr/share/nginx/html/assets/env.js <<EOF
window.__env = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF

# Optional: small health page
echo "OK" > /usr/share/nginx/html/healthz.txt

exec nginx -g "daemon off;"
