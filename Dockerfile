FROM node:16.17.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
# required for docker desktop port mapping

# Set environment variables from the .env file
ENV PORT=3000
ENV NODE_ENV=DEVELOPMENT
ENV MONGODB_URL=mongodb+srv://hamza:hamza123@cluster0.9lauuar.mongodb.net/?retryWrites=true&w=majority
ENV JWT_SECRET=ecommercewebapi

CMD ["npm", "start"]