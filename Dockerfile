FROM ubuntu:latest

RUN apt-get update && apt-get install -y curl git

# Install Node.js v20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Setup git
RUN git config --global user.email "jmn09@mail.aub.edu"
RUN git config --global user.name "JMN09"

WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/

RUN ls -la

RUN npm ci
COPY . /app
RUN ls -la
RUN chmod -R 755 /app/node_modules

RUN npm run build
