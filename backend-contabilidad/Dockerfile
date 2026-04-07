# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Optimize: Copy only Pom first to cache dependencies layer
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage (Production Hardened)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add a non-root user for security
RUN addgroup -S accounting && adduser -S accounting -G accounting
USER accounting

COPY --from=build /app/target/*.jar app.jar

# Standard JVM Optimization for Containers
ENV JAVA_OPTS="-XX:+UseParallelGC -Xms256m -Xmx512m -XX:MaxRAMPercentage=75.0"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
