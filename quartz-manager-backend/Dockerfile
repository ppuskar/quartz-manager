FROM openjdk:25-ea-21-jdk-slim
WORKDIR /app
COPY target/quartz-manager-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
