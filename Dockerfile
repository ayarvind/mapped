# Build stage
FROM node:18-alpine AS build-stage

# Install required dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy only dependency-related files for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code and Prisma configuration
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-alpine AS production-stage

# Set working directory and environment
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
RUN apk add --no-cache curl
# Copy built app and runtime dependencies from build stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/prisma ./prisma
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "run","dev"]
