# Stage 1: Build the application
FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup production image
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist/apps/gateway ./dist
COPY --from=build /usr/src/app/config/gateway ./config/gateway
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/main.js"]
