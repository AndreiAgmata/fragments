# ./Dockerfile

#Every Dockerfile must begin with a FROM instruction
# Use node version 18.13.0
FROM node:18.17.1

LABEL maintainer="Andrei Agmata <aagmata@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

######LAB 7 CHANGES########
# Use /app as our working directory
# WORKDIR /app

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
# COPY package*.json /app/

# Install node dependencies defined in package-lock.json
# RUN npm install

# Copy src to /app/src/
# COPY ./src ./src

# Start the container by running our server
# CMD npm start

# We run our service on port 8080
# EXPOSE 8080

# Copy src/
# COPY ./src ./src

# Copy our HTPASSWD file
# COPY ./tests/.htpasswd ./tests/.htpasswd

# Run the server
# CMD npm start
######LAB 7 CHANGES########

# Multi-Stage Builds Lab 6

FROM node:18.17.1

LABEL maintainer="Andrei Agmata <aagmata@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# We run our service on port 8080
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
