# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# production-stage
FROM nginx:1.16.1-alpine as production-stage
WORKDIR /etc/nginx
RUN rm ./conf.d/default.conf
COPY ./docker/conf ./conf.d/
COPY --from=build-stage /app/dist ./html/
