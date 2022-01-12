# base image
FROM keymetrics/pm2:latest-alpine

# set working directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install


# Install pm2 so we can run our application
RUN npm i -g typescript ts-node


# Bundle app source
COPY . .

# Show current folder structure in logs
RUN ls -al

# Specify port
EXPOSE 3000

# start app
CMD [ "npm", "run", "start:dev" ]