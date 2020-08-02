FROM node:10
#FROM node:8.1.0-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package.json /usr/app
#COPY yarn.lock /usr/app

RUN yarn install

# Copy app source
COPY webpack.config.js /usr/app
COPY index.js /usr/app


EXPOSE 8000
#CMD ["yarn", "run", "start"]