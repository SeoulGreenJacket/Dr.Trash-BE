FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . ./

ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
