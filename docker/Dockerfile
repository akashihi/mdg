FROM openjdk:11-slim
LABEL Description="MDG server image"
ADD mdg.tgz /srv
ENTRYPOINT ["/srv/mdg/bin/mdg","-Dslick.dbs.default.db.url=jdbc:postgresql://postgres:5432/mdg", "-Delasticsearch.url=http://elasticsearch:9200", "-J-Xms256M","-J-Xmx512m"]