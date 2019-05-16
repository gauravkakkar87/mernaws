FROM node:8-alpine

# Create app directory
WORKDIR /server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY wait-for.sh ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /

EXPOSE 4000
CMD [ "npm", "start" ]