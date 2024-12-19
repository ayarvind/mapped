# Build stage
FROM node:18-alpine AS build-stage

# Update and install necessary packages (if needed)
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application code and Prisma configuration
COPY . . 
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-alpine AS production-stage

WORKDIR /app
ENV NODE_ENV=production

# Install only necessary runtime packages
RUN apk add --no-cache openssl

# Copy built app and runtime dependencies from build stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/prisma ./prisma
COPY package*.json ./

RUN npm install --production

# Expose the desired port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
