# Backend API Showcase
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)
This project is a backend API designed to demonstrate my skills and capabilities in building robust, scalable, and maintainable server-side applications. This API is developed using Node.js with TypeScript, leveraging modern development practices and tools. The API is containerized using Docker and managed with docker-compose to ensure a consistent and isolated environment for development, testing, and deployment.

## Features
- User Management: Secure authentication and authorization mechanisms to manage users.
- RESTful Endpoints: Well-structured and documented RESTful endpoints for easy integration.
- Database Integration: Efficient interaction with a MySQL database to store and retrieve data.
- Middleware: Utilization of Express middleware for validation, logging, and error handling.
- CI/CD Pipeline: Automated CI/CD pipeline setup using GitHub Actions to ensure continuous integration and deployment.
- Testing: Comprehensive unit and integration tests to ensure code reliability and functionality.
- Swagger Documentation: API documentation using Swagger for clear and concise API reference.

## Technologies Used
- Node.js: A powerful and flexible JavaScript runtime for building server-side applications.
- TypeScript: A statically typed superset of JavaScript that enhances code quality and maintainability.
- Express: A minimal and flexible Node.js web application framework for building APIs.
- MySQL: A reliable relational database management system for data storage and retrieval.
- Docker: Containerization technology to create, deploy, and run applications in isolated environments.
- GitHub Actions: CI/CD service to automate the build, test, and deployment pipeline.
- Swagger: A tool for API documentation and design.

## Getting Started
### Prerequisites
- Node.js and npm installed
- Docker and docker-compose installed

### Setup
1. Clone the repository:
```
git clone https://github.com/yourusername/backend-api-server.git
cd backend-api-server
```
2. Install dependencies:
```
npm install
```
3. Create a `.env` file in the root directory and add your environment variables.
4. Start the application using docker-compose:
```
docker-compose up
```
##### Usage
Once the application is running, you can access the API documentation at http://localhost:3000/api-docs (assuming port 3000 is used).

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.

-------------------------------