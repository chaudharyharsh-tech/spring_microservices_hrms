FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .

RUN sed -i '/<parent>/,/<\/parent>/d' pom.xml

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package

FROM tomcat:10.1-jdk21 AS runner

COPY --from=builder ./app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080