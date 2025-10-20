
# 💻 CodeQuest Backend

**Real-Time Collaborative Coding Interview Platform – Backend**

[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![WebSocket](https://img.shields.io/badge/WebSocket-Enabled-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Used-blue.svg)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Used-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🧠 Overview

**CodeQuest** is a full-stack collaborative coding interview platform built to simulate real-time technical interview scenarios. This is the **backend** repository, developed using **Spring Boot**, designed to power the core functionality including:

- Real-time collaboration via WebSocket
- Interview room & session management
- Google OAuth2 authentication
- AI integrations (resume-job match, salary prediction)
- RESTful APIs for frontend interaction

---

## 🚀 Features

- 🔐 **Google OAuth2 Authentication** with JWT support
- 🧑‍💻 **Interview Room APIs** (create, join, manage)
- 🛠 **Real-time Collaboration** using WebSocket
- 🧾 **Problem Management APIs** (question bank, admin panel)
- 🔗 **RESTful API** endpoints consumed by the React frontend

---

## 🛠️ Tech Stack

| Technology      | Purpose                          |
|-----------------|----------------------------------|
| Java 17         | Programming Language             |
| Spring Boot 3   | Backend Framework                |
| WebSocket       | Real-time Collaboration          |
| MongoDB         | NoSQL (Resumes, AI models)       |
| Apache Tika     | Data Parsing (PDF/DOCX)        |
| OAuth2 + JWT    | Secure Authentication            |

---

## 📁 Project Structure

```
src
├── config          // Security & CORS Config
├── controller      // REST & WebSocket Controllers
├── dto             // Request/Response DTOs
├── model           // JPA & MongoDB Models
├── repository      // JPA + MongoDB Repositories
├── service         // Business Logic Layer
└── util            // Utility Classes
```

---

## 🔐 Authentication

- Uses **Google OAuth2** via Spring Security.
- Issues **JWT** token on successful login.
- Role-based access control for:
  - 🧑‍💼 Employers
  - 👨‍💼 Admins

---

## 🧪 Setup & Run

### Prerequisites

- Java 17+
- Maven
-  MongoDB running locally or via Docker

### Steps

```bash
# Clone the repo
git clone https://github.com/Akash-Adak/CodeQuestBackend.git
cd CodeQuestBackend

# Configure DB in application.properties
# src/main/resources/application.properties

# Run the app
./mvnw spring-boot:run
```

---

## 🌐 API Documentation

- Swagger/OpenAPI integration *(Coming Soon)*

---

## ✅ Upcoming Features

- 🛡 Admin Panel for Question Bank
- 📚 Interview Analytics & Reports

---

## 🤝 Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create a feature branch  
3. Commit your changes  
4. Submit a pull request 🚀

---

## 📄 License
This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Akash Adak**  
🔗 [LinkedIn](https://www.linkedin.com/in/akash-adak-b9334b2b9/)  
📧 akashadak019@gmail.com

---

> ⭐ Star this repo if you found it helpful!
