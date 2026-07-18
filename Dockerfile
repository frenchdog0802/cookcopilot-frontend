# Build
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
# Railway often injects NODE_ENV=production; vite/rollup live in devDependencies.
# bookworm (glibc) avoids Alpine/musl optional @rollup/rollup-*-musl install failures.
RUN npm ci --include=dev

COPY . .

# Empty = same-origin /api (local compose uses nginx.compose.conf to proxy).
# Railway (separate services): set build var to backend public URL, e.g.
#   VITE_API_BASE_URL=https://lardermind-api.up.railway.app
ARG VITE_API_BASE_URL=
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Runtime
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
