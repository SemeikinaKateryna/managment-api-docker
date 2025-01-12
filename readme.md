
# Employee Management API

A RESTful API for managing employee data, including CRUD operations for employee records, designed to support organizational employee management with PostgreSQL as the database.

## Application Overview

This application is an employee management system designed for administrators and company employees. Administrators can add new employees, edit their data, assign positions, manage salary levels, and view salary increase histories. The application automatically tracks salary raise dates for employees and sends notifications to administrators one month before the scheduled increase. Additionally, the system sends notifications about upcoming employee birthdays to help administrators congratulate employees on time.

Employees can update their personal information, such as name, contact details, and programming languages, while certain fields, like salary or position, are editable only by administrators. All changes to employee profiles are automatically logged, and notifications are sent to administrators. Notifications also include employee status updates, such as current project or English language proficiency. The application ensures regular data checks and sends important notifications through a task scheduler.

## Features

- **Employee Management**: Create, read, update, and delete employee records.
- **Data Validation**: Ensures data integrity with robust validation.
- **Search and Filter**: Allows filtering employees by various criteria.
- **Pagination**: Supports paginated employee listings.
- **Error Handling**: Comprehensive error management for reliability.

## Getting Started

### Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org/) (version 14 or higher recommended).
- **npm**: Comes with Node.js but can be updated independently.
- **PostgreSQL**: Install and configure [PostgreSQL 16](https://www.postgresql.org/) as the database for employee data.

### Installation

1. Clone the repository:
   ```sh
   git clone
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

1. Create a `.env` file in the root of the project.
2. Add the following environment variables:
   ```plaintext
   # Локальная база данных
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=employee_db
   DB_USER=your_local_db_user
   DB_PASSWORD=your_local_db_password

   # Секреты
   JWT_SECRET=your_jwt_secret
   SECRET_WORD=your_secret_word_for_admin_registration

   # Среда разработки
   NODE_ENV=development

   # Порт (опционально, по умолчанию 3000)
   PORT=3000
   ```
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Данные для подключения к базе данных PostgreSQL.
   - `JWT_SECRET`: Секретный ключ для аутентификации JWT.
   - `SECRET_WORD`: Секретный ключ для регистрации администратора.
   - `NODE_ENV`: Указывает среду выполнения.
   - `PORT`: Порт, на котором будет работать сервер (по умолчанию 3000).

Замените `your_local_db_user`, `your_local_db_password`, `your_jwt_secret`, и `your_secret_word_for_admin_registration` на свои реальные значения.

### Running the Application

Start the server in development mode:
   ```sh
   npm run dev
   ```
The server will be running at `http://localhost:3000`.

### Running the Tests

The 5 tests was developed and located in a file `users_api.test.js`. To run the developed tests locally use the command:
   ```sh
   npm run test
   ```

### API Documentation

Access the interactive API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) if Swagger or a similar tool is set up. This documentation provides a complete view of the available endpoints and allows for interactive testing.

### Docker

This application can also be containerized using Docker. Here’s how it was setted up:

1. **Dockerfile**: Added a `Dockerfile` to the root of the project with the name `docker-compose-test.yml` with ability of running API and tests locally by one command. 
In this file the new environment `startAndTest` is used.

2. To run API and tests locally in a docker file use this command:
   ```sh 
   npm run start-and-test
   ```

3. **Build and Run the Docker Container**:
   - To build and run the container using Docker Compose, run:
     ```sh
     docker:compose:up:start-and-test
     ```
   - This command will start both the PostgreSQL database, the API server and developed 5 tests. The API will be accessible at `http://localhost:3000`.

4. **Stopping and Removing Containers**:
   - To stop and remove containers, along with associated volumes, run:
     ```sh
     docker:compose:down:start-and-test
     ```

## API Documentation

Access the interactive API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view and test available endpoints.

### Available Scripts

- **`npm run dev`**: Runs the app in development mode with hot reloading.
- **`npm start`**: Runs the app in production mode.
- **`npm test`**: Runs test cases for the application.
- **`npm run lint`**: Lints the project files to enforce consistent code style.

## API Endpoints

| Method | Endpoint                          | Description                               |
|--------|------------------------------------|-------------------------------------------|
| GET    | `/users`                         | List all users                            |
| GET    | `/users/:id`                     | Get a specific user by ID                |
| POST   | `/users`                         | Create a new user                         |
| PUT    | `/users/:id`                     | Update user information                   |
| DELETE | `/users/:id`                     | Delete a user                            |
| POST   | `/login`                         | Authenticate user                         |
| POST   | `/register`                      | Register a new user                       |
| GET    | `/notifications`                 | Get all notifications for the user        |
| POST   | `/notifications/mark-as-read`    | Mark notifications as read                |

### Example Requests

- **Get all users**: `GET /users`
- **Get user by ID**: `GET /users/:id`
- **Add new user**: `POST /users` with JSON body containing user data.
- **Update user**: `PUT /users/:id` with JSON body of updated data.
- **Delete user**: `DELETE /users/:id`
- **Get current user's profile**: `GET /users/me`
- **User login**: `POST /login` with JSON body containing credentials.
- **User registration**: `POST /register` with JSON body containing user details.
- **Get notifications**: `GET /notifications`
- **Mark notifications as read**: `POST /notifications/mark-as-read` with JSON body containing notification IDs.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
