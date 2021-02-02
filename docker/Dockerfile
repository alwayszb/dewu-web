# cache stage
FROM node:14-alpine as node_cache

WORKDIR /cache

COPY . ./

RUN ls -l

RUN npm install --registry=https://r.npm.taobao.org

RUN npm run build

# build stage
FROM nginx:1.12-alpine

WORKDIR /etc/nginx

COPY conf/** ./conf.d/
COPY --from=node_cache /cache/dist ./html/

EXPOSE 9000
