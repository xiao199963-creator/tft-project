FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY index.html ./
COPY src ./src
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
