# -------- Build --------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# -------- Run (nginx) --------
FROM nginx:alpine

# SPA fallback (Angular routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/personal_finance_frontend/browser/ /usr/share/nginx/html

EXPOSE 80
