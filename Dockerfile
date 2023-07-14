FROM node:18-alpine as builder

# Create app directory (with user `node`)
RUN mkdir -p /opt/api-backend

WORKDIR /opt/api-backend


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN yarn install

# Bundle app source code
COPY --chown=node . .

RUN yarn run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=5000

EXPOSE ${PORT}

CMD [ "npm", "run", "start:prod" ]
