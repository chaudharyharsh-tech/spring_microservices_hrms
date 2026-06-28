# Employee Management System - Spring MVC with Microservices

![Java](https://img.shields.io/badge/Java-21-blue.svg)
![Spring](https://img.shields.io/badge/Spring%20MVC-6.1-brightgreen.svg)
![Maven](https://img.shields.io/badge/Maven-3.11-red.svg)
![Database](https://img.shields.io/badge/Database-SQL%20Server-orange.svg)

A robust, full-featured Employee Management System built with a classic Spring MVC architecture. This project demonstrates a deep understanding of core Spring concepts, layered architecture, RESTful API design, and modern data access techniques.

## Table of Contents

1.  [Live Demo](#live-demo)
2.  [Core Technologies](#core-technologies)
3.  [Key Features](#key-features)
4.  [Project Architecture](#project-architecture)
5.  [API Endpoints](#api-endpoints)
6.  [Database Schema](#database-schema)
7.  [Configuration Highlights](#configuration-highlights)
8.  [Getting Started](#getting-started)
9.  [Future Improvements](#future-improvements)
10. [Contact](#contact)

## Live Demo

[TODO: Add a link to the live, deployed application if available.]

---

## Core Technologies

-   **Backend:** Java 21, Spring MVC 6.1
-   **Database:** Microsoft SQL Server
-   **Build & Dependency Management:** Apache Maven
-   **Data Access:**
    -   Spring `JdbcTemplate` for clean, modern data access.
    -   HikariCP for high-performance database connection pooling.
    -   Raw JDBC with manual transaction control where necessary.
-   **Deployment and CI/CD:** Using Docker images to deploy the project alongwith help of Docker Compose to orchestrate and Github Actions for CI. 
-   **API:** RESTful web services with JSON payloads.
-   **Server:** Deployed as a WAR file on a servlet container like Apache Tomcat.
-   **Logging:** SLF4J with Logback for structured application logging.
-   **Exception Handling**: Global Exception handling and dedicated wherever felt necessary.

---

## Key Features

-   **Microservices Architecture**: Various services talking among themselves using GRPC and Kafka respectively wherever appropriate.
-   **Employee Management:** Full CRUD (Create, Read, Update, Delete) functionality for employee records.
-   **Dynamic Employee Creation:** Utilizes Java Reflection to dynamically build insert statements, allowing for the creation of employees even with partial data.
-   **Attendance Tracking:**
    -   Mark daily attendance for employees (Present, Absent, Leave).
    -   Uses an efficient SQL statement for logic, allowing attendance to be marked or updated in a single database call.
    -   Retrieve attendance reports for a specific date or a specific employee.
-   **Salary Management:** Functionality to create and update employee salary information.
-   **Robust Error Handling:** A centralized, global exception handling mechanism using `@ControllerAdvice` to translate low-level data exceptions into meaningful, user-friendly HTTP error responses.
-   **Layered Architecture:** A clean separation of concerns between the Controller (API layer), Service (business logic layer), and DAO (data access layer).

---

## Project Structure

The application follows a standard, layered architecture which promotes separation of concerns, maintainability, and testability for each service.

### *Employee Service*

```
employee-management-service/
    ├── pom.xml
    └── src/
        └── main/
            ├── java/
            │   └── springmvc/
            │       ├── config/         (Spring Java-based configuration)
            │       ├── controllers/    (API layer - REST endpoints)
            │       ├── dao/            (Data Access Layer - JDBC/JdbcTemplate)
            │       ├── dto/            (Data Transfer Objects)
            │       ├── exceptions/     (Custom business exceptions & global handler)
            │       ├── mapper/         (RowMappers for JdbcTemplate)
            │       ├── model/          (Domain objects/entities)
            │       └── service/        (Business Logic Layer)
            │
            └── resources/              (Properties, Logback config, SQL scripts)

```

### *Salary Account Service*


---

## API Endpoints

| Method | Endpoint                      | Description                                         |
| :----- | :---------------------------- | :-------------------------------------------------- |
| `POST` | `/employees`                  | Creates a new employee record.                      |
| `GET`  | `/employees`                  | Retrieves a list of all employees.                  |
| `GET`  | `/employees/{id}`             | Retrieves a single employee by their ID.            |
| `DELETE`| `/employees/{id}`             | Deletes an employee by their ID.                    |
| `POST` | `/attendance`                 | Marks or updates attendance for an employee on a given date. |
| `GET`  | `/attendance/date/{date}`     | Retrieves attendance records for all employees on a specific date. |
| `GET`  | `/attendance/employee/{id}`   | Retrieves the full attendance history for a single employee. |
| `POST` | `/employees/{id}/salary`      | Creates or updates the salary for a specific employee. |

---

## Database Schema

There are two separate databases here: one which talks to employee service and other one for Salary Account service.


### Employee Service Database
The database consists of three core tables to manage employee data and attendance.

**`employee` Table**
Stores core information about each employee.

| Column          | Type         | Constraints       |
| :-------------- | :----------- | :---------------- |
| `id`            | `INT`        | `PRIMARY KEY`     |
| `name`          | `VARCHAR(50)`|                   |
| `position`      | `VARCHAR(50)`|                   |
| `dateofbirth`   | `DATE`       |                   |
| `dateofjoining` | `DATE`       |                   |
| `aadharnumber`  | `VARCHAR(16)`| `UNIQUE`          |
| `esino`         | `VARCHAR(50)`| `UNIQUE`          |
| `esiContribution`| `VARCHAR(50)`|                   |

**`AttendanceStatuses` Table**
A lookup table for attendance statuses.

| Column     | Type         | Constraints    |
| :--------- | :----------- | :------------- |
| `StatusID` | `tinyint`    | `PRIMARY KEY`  |
| `StatusName`| `VARCHAR(20)`| `UNIQUE`       |

**`AttendanceLogs` Table**
Logs a daily attendance record for each employee.

| Column         | Type        | Constraints                               |
| :------------- | :---------- | :---------------------------------------- |
| `AttendanceID` | `bigint`    | `PRIMARY KEY`                             |
| `UserID`       | `int`       | `FOREIGN KEY` references `employee(id)`   |
| `AttendanceDate`| `DATE`      |                                           |
| `StatusID`     | `tinyint`   | `FOREIGN KEY` references `AttendanceStatuses(StatusID)` |
| `CreatedAtUtc` | `datetime2` | `DEFAULT SYSUTCDATETIME()`                |
| **Compound Key** | `(UserID, AttendanceDate)` | `UNIQUE` |

---

## Getting Started

[TODO: Fill this section with the specific steps for deployment.]

### Prerequisites

-   Java 21 (or your specific JDK version)
-   Apache Maven
-   Microsoft SQL Server
-   An IDE like IntelliJ IDEA or Eclipse

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/chaudharyharsh-tech/spring_microservices_hrms.git
    ```
2.  **Database Setup:**
    -   Ensure your SQL Server instance is running.
    -   Create a new database named `employee_db`.
    -   Run the `src/main/resources/data.sql` script against the `employee_db` database to create the tables, indexes, and seed initial data.
3.  **Configure Connection:**
    -   Open `src/main/resources/database.properties`.
    -   Update the `db.username` and `db.password` to match your SQL Server credentials.

[Yet to be done]

---

## Future Improvements

[TODO: This is a great section to show you think about the future of your projects.]

-   **Implement Security:** Add Spring Security to protect endpoints with role-based access control (e.g., only HR can view salary data).
-   **Add Unit and Integration Tests:** Build out a comprehensive test suite using JUnit and Mockito to ensure code quality and prevent regressions.
-   **Containerize the Application:** Create a `Dockerfile` to containerize the application for easy deployment and scaling.
-   **CI/CD Pipeline:** Set up a GitHub Actions workflow to automatically build, test, and deploy the application on every push to the main branch.

---

## Contact

[TODO: Add your name and contact information.]

Created by Harsh Chaudhary - feel free to contact me!
-   Email: `[work.chaudhryharsh.com]`
-   LinkedIn: `[https://www.linkedin.com/in/harsh-chaudhary-833032146/]`
