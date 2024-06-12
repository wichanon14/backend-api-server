# This Dockerfile is used to build an image containing an environment for running the backend of the application
FROM node:21-alpine

# for prisma
RUN apk add --no-cache openssl

# Ensure npm is installed
RUN npm install -g npm

# set working directory in the container
WORKDIR /app

# copy the dependencies file to the working directory. Exclude file in .dockerignore
COPY package*.json .

# install dependencies
RUN npm install
# ensure install nodemon
RUN npm install -g nodemon
# ensure install typescript
RUN npm install -g typescript
# ensure install for tsc 
RUN npm install -g ts-node

COPY . .

# generate prisma client
RUN npx prisma generate

# build app
RUN npm run build

# expose port 3000
EXPOSE 3000
