FROM node:20-alpine AS build
WORKDIR /app
COPY api-dotnet-frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY api-dotnet-frontend/ ./
RUN npm run build

FROM nginx:1.27-alpine AS runtime
# Nginx config
COPY api-dotnet-frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Static app
COPY --from=build /app/dist/api-dotnet-frontend/browser /usr/share/nginx/html
# Entry point that generates env.js
COPY api-dotnet-frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/healthz.txt >/dev/null 2>&1 || exit 1
ENTRYPOINT ["/docker-entrypoint.sh"]
