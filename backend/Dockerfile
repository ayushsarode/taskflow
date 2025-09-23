# Use Alpine for smaller size
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies and clean cache
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf ~/.npm

# Copy app code
COPY . .

EXPOSE 8080


CMD ["npm", "start"]