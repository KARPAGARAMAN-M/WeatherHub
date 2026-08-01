# Stage 1: Build Java 21 Spring Boot Application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and dependency definitions
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build final executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built jar file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Dynamic Port assignment (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
