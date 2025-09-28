# Step 1: Build the React app
FROM node:14 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app to Nginx web root
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 for ALB health checks and traffic
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
