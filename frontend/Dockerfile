FROM node:22.4 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
ARG VITE_BACKEND_PORT=3001
RUN yarn build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html/
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
