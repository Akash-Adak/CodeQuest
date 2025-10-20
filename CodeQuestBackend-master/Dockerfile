# Stage 1: Build the application using Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application with OpenJDK
FROM openjdk:21-jdk-slim

WORKDIR /app


# Copy the jar from the build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend.jar"]
