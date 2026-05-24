# Project Documentation

Welcome to the Hospital Bed Management Project! This documentation provides a comprehensive overview of the application's structure and explains the purpose of every module in a way that is easy to understand, especially for beginners.

## Overview

This project is a Full-Stack application designed to manage hospital bed availability and patient admissions.
- **Backend**: Built with Java and Spring Boot. It uses a MySQL database to store patient information.
- **Frontend**: Built with React.js using Vite. It provides a simple, decent user interface for interacting with the backend.

---

## Backend Modules (`src/main/java/com/example/demo/`)

The backend follows the standard Spring Boot layered architecture. This separates concerns, making the code easy to read and maintain.

### 1. Model Layer (`model/`)
This layer defines the core data structures (entities) of our application.
- **`Patient.java`**: Represents a patient in the hospital. It includes fields like `patientId`, `patientName`, `age`, `disease`, and `roomType`. The `@Entity` annotation tells Spring to map this class to the `patients` table in the MySQL database.
- **`Room.java`**: A utility class representing a hospital room/ward. It tracks the `roomNo`, total `beds`, and a list of `patients` currently assigned to that room.

### 2. Repository Layer (`repository/`)
This layer is responsible for database interactions.
- **`PatientRepository.java`**: An interface extending `JpaRepository`. It acts as a bridge between the application and the MySQL database. It automatically provides methods to save, find, and delete `Patient` records. It also includes a custom method `findByRoomType(String roomType)` to easily get all patients in a specific ward.

### 3. Service Layer (`service/`)
The Service layer contains the core business logic of the application.
- **`HospitalService.java`**: This module acts as the "brain" of the backend. It keeps track of the total number of beds for each ward (Emergency, General, General 2) and performs logic like checking if a bed is available (`findEmptyBed`) or assigning a new patient (`assignPatient`) before saving them via the `PatientRepository`.

### 4. Controller Layer (`controller/`)
This layer handles incoming HTTP requests from the frontend and sends back responses.
- **`HospitalController.java`**: This module exposes "endpoints" (URLs) that the React frontend can call. For example:
  - `GET /api/hospital/{type}/beds`: Returns the total bed count.
  - `POST /api/hospital/{type}/assign`: Accepts patient data and assigns them to a bed.
  - `DELETE /api/hospital/{type}/discharge/{id}`: Discharges a patient by their ID and frees up their bed.
  - `GET /api/hospital/{type}/patients`: Returns the list of admitted patients.

---

## Frontend Modules (`frontend/src/`)

The frontend is a single-page React application designed to be decent, modern, and simple.

### 1. Core Application (`App.jsx` & `main.jsx`)
- **`main.jsx`**: The entry point of the React application. It attaches the React app to the HTML document.
- **`App.jsx`**: The main layout component. It renders the Sidebar (for navigating between different hospital wards) and the Topbar. It maintains the state of the currently `activeRoom` (e.g., "emergency" or "general") and passes it down to the `RoomPanel`.

### 2. Components (`Components/`)
- **`RoomPanel.jsx`**: This is the core interactive module of the frontend. It receives the `roomType` from `App.jsx` and performs the following tasks:
  - Fetches the current bed count and patient list from the backend.
  - Displays statistics (Total Beds, Occupancy).
  - Provides a form to assign a new patient to the selected room.
  - Renders a list of all patients currently admitted to that room.

### 3. Styling (`App.css` & `index.css`)
- **`App.css`**: Contains custom CSS variables and styling rules for the application. It ensures a decent, dark-themed UI with clean typography, simple colors, and smooth hover effects.
- **`index.css`**: Global resets and foundational styling for the web page.
