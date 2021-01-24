FROM nginx:1.12-alpine

WORKDIR /etc/nginx

COPY conf/** ./conf.d/
COPY ./dist ./html/

EXPOSE 9000
