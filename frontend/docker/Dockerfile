FROM nginx:alpine
LABEL Description="MDG web UI server image"
ADD dist.tar.gz /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
