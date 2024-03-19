# Stage 1: Build the application
FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:billing

# Stage 2: Setup production image
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist/apps/billing-service ./dist
COPY --from=build /usr/src/app/config/billing ./config/billing
COPY package*.json ./
RUN npm install --omit=dev
CMD ["node", "dist/main.js"]
