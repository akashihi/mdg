FROM openjdk:17-slim
LABEL Description="MDG server image"
ADD backend/target/mdg.jar /srv
EXPOSE 8080
ENTRYPOINT ["java","-Dspring.profiles.active=docker", "-Xms256M","-Xmx512m", "-jar", "/srv/mdg.jar"]