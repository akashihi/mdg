FROM openjdk:18-slim
LABEL Description="MDG server image"
ADD target/mdg.jar /srv
EXPOSE 8080
ENTRYPOINT ["java","-Dspring.profiles.active=docker", "-Xms256M","-Xmx512m", "-jar", "/srv/mdg.jar"]