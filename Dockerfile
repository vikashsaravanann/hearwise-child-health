FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install

COPY . .
RUN bun run build

FROM nginx:alpine
# Copy the built app to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Cloud Run overrides this via PORT env var, but nginx defaults to 80)
EXPOSE 80

# Overwrite default nginx config to serve index.html for React Router
RUN echo 'server { \
    listen       80; \
    listen  [::]:80; \
    server_name  localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]