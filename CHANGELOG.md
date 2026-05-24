# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Implemented a theme toggle allowing users to switch between a clean white default theme and a dark mode.
- Added a feature to discharge (remove) a patient from the database, including a backend `DELETE` endpoint and a frontend 'Discharge' button in the Room Panel.
- Created `PROJECT_DOCS.md` to provide detailed documentation on each module.
- Retained MySQL database configuration as per user requirements.

### Improved
- Validated the existing backend structure, which uses a straightforward Spring Boot architecture (`HospitalController`, `HospitalService`, `PatientRepository`, `Patient`, `Room`) to ensure it is very accessible to beginners.
- Kept the React UI clean and minimal, leveraging simple state hooks without overly complex state management to ensure readability.
