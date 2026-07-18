# Build
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
# Railway often injects NODE_ENV=production; vite/rollup live in devDependencies.
# npm optional-deps bug: Windows lockfiles may omit Linux Rollup natives — force install.
RUN npm ci --include=dev \
  && npm install --no-save @rollup/rollup-linux-x64-gnu@4.52.5

COPY . .

# Empty = same-origin /api (local compose uses nginx.compose.conf to proxy).
# Railway (separate services): set build var to backend public URL, e.g.
#   VITE_API_BASE_URL=https://lardermind-api.up.railway.app
ARG VITE_API_BASE_URL=
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Runtime — nginx image substitutes ${PORT} in /etc/nginx/templates/*.template
FROM nginx:1.27-alpine
ENV PORT=80
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/app /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
