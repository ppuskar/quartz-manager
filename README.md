# Quartz Manager

[![License](https://img.shields.io/badge/License-MIT%20NonCommercial-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

A  web-based management interface for Quartz Scheduler, built with Spring Boot and React.

> **License Notice**: This software is free for non-commercial use only. Commercial use is prohibited without permission. See [LICENSE](LICENSE) for details.

## Features

- **Job Management**: Create, edit, delete, and view scheduled jobs
- **HTTP Job Support**: Configure HTTP requests as scheduled jobs (GET, POST, PUT, DELETE)
- **Execution History**: Track job execution history with status, timestamps, and duration
- **Real-time Monitoring**: View job status, next execution time, and execution logs
- **Modern UI**: Professional interface with sidebar navigation, floating headers, and responsive design
- **Cron Expression Support**: Flexible scheduling with cron expressions

## Tech Stack

### Backend
- Spring Boot 4.0.2
- Quartz Scheduler 2.5.1
- MySQL 8.0
- Java 25

### Frontend
- React 18
- TypeScript
- Vite
- Lucide React (icons)

## Architecture

- **Backend**: Spring Boot REST API (`quartz-manager-backend`)
- **Frontend**: React SPA (`quartz-manager-frontend`)
- **Database**: MySQL for Quartz tables and execution history
- **Reverse Proxy**: Nginx for routing

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Java 25** (for local development)
- **Maven 3.8+** (for local development)
- **Node.js 18+** (for local development)

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose:

### 1. Clone the Repository

```bash
git clone https://github.com/ppuskar/quartz-manager.git
cd quartz-manager
```

### 2. Build the Backend

```bash
cd quartz-manager-backend
mvn clean package -DskipTests
cd ..
```

### 3. Start All Services

```bash
docker-compose up -d
```

This will start:
- **MySQL** database on port `3307`
- **Backend** API on port `8080`
- **Frontend** on port `3000`
- **Nginx** reverse proxy on port `80`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The application will be available at the root URL, with:
- Frontend served at `/`
- Backend API at `/api/*`

## Running Locally (Development)

### Backend

1. **Start MySQL Database**:
   ```bash
   docker-compose up -d db
   ```

2. **Configure Application Properties**:
   Edit `quartz-manager-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3307/quartz_manager
   spring.datasource.username=root
   spring.datasource.password=rootpassword
   ```

3. **Run Backend**:
   ```bash
   cd quartz-manager-backend
   mvn spring-boot:run
   ```

   Backend will be available at `http://localhost:8080`

### Frontend

1. **Install Dependencies**:
   ```bash
   cd quartz-manager-frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

3. **Configure Proxy** (if needed):
   Update `vite.config.ts` to proxy API requests to backend:
   ```typescript
   server: {
     proxy: {
       '/api': 'http://localhost:8080'
     }
   }
   ```

## Docker Commands

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app-backend
docker-compose logs -f app-frontend
docker-compose logs -f db
```

### Rebuild Services
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build app-backend
docker-compose up -d --build app-frontend
```

### Access Database
```bash
docker exec -it quartz-db mysql -u root -p
# Password: rootpassword
```

## Configuration

### Database Configuration

The database is configured in `docker-compose.yml`:
```yaml
MYSQL_ROOT_PASSWORD: rootpassword
MYSQL_DATABASE: quartz_manager
```

And in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://db:3306/quartz_manager
spring.datasource.username=root
spring.datasource.password=rootpassword
```

### Execution History Retention

Configure how long execution history is kept (default: 30 days):
```properties
quartz.history.retention-days=30
```

### Nginx Configuration

The Nginx reverse proxy is configured in `nginx/nginx.conf`:
- Frontend: `/` → `http://app-frontend:80`
- Backend API: `/api/` → `http://app-backend:8080/api/`

## Usage

### Creating a Job

1. Click the **"Create Job"** button on the dashboard
2. Fill in the job details:
   - **Job Name**: Unique identifier for the job
   - **Job Group**: Logical grouping (default: DEFAULT)
   - **Description**: Optional description
   - **Cron Expression**: Schedule (e.g., `0 */5 * * * ?` for every 5 minutes)
3. Configure HTTP request:
   - **Method**: GET, POST, PUT, or DELETE
   - **URL**: Target endpoint
   - **Body**: Request body (for POST/PUT)
4. Add custom job data (key-value pairs) if needed
5. Click **"Create Job"**

### Viewing Job Details

1. Click the **eye icon** (👁️) on any job in the list
2. View job configuration, cron expression, and execution history
3. Click **"Back"** to return to the dashboard

### Viewing Execution History

1. Click the **history icon** (🕐) on any job in the list
2. View:
   - Last run datetime
   - Next run datetime
   - Total executions
   - Detailed execution history table

### Editing a Job

1. Click the **edit icon** (✏️) on any job in the list
2. Modify job details
3. Click **"Update Job"** to save changes

### Deleting a Job

1. Click the **delete icon** (🗑️) on any job in the list
2. Confirm deletion

## API Endpoints

### Jobs

- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/{group}/{name}` - Update a job
- `DELETE /api/jobs/{group}/{name}` - Delete a job

### Execution History

- `GET /api/history/{group}/{name}` - Get execution history for a job

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :80
netstat -ano | findstr :3307

# Check what's using the port (Linux/Mac)
lsof -i :80
lsof -i :3307

# Stop the conflicting service or change ports in docker-compose.yml
```

### Database Connection Issues

1. Verify MySQL is running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Verify connection from backend:
   ```bash
   docker-compose logs app-backend | grep -i "database\|connection"
   ```

### Frontend Not Loading

1. Check if frontend container is running:
   ```bash
   docker-compose ps app-frontend
   ```

2. Rebuild frontend:
   ```bash
   docker-compose up -d --build app-frontend
   ```

3. Check Nginx logs:
   ```bash
   docker-compose logs nginx
   ```

### Backend API Errors

1. Check backend logs:
   ```bash
   docker-compose logs app-backend
   ```

2. Verify backend is healthy:
   ```bash
   curl http://localhost:8080/api/jobs
   ```

3. Rebuild backend:
   ```bash
   cd quartz-manager-backend
   mvn clean package -DskipTests
   cd ..
   docker-compose up -d --build app-backend
   ```

### Execution History Not Showing

1. Verify the `execution_logs` table exists:
   ```bash
   docker exec -it quartz-db mysql -u root -p
   USE quartz_manager;
   SHOW TABLES;
   SELECT * FROM execution_logs LIMIT 10;
   ```

2. If table doesn't exist, create it manually:
   ```sql
   CREATE TABLE execution_logs (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       job_name VARCHAR(200) NOT NULL,
       job_group VARCHAR(200) NOT NULL,
       fire_time DATETIME NOT NULL,
       end_time DATETIME,
       status VARCHAR(50),
       duration BIGINT,
       message TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Clean Start

To completely reset the application:

```bash
# Stop and remove all containers, volumes
docker-compose down -v

# Remove images
docker rmi quartz-manager-app-backend quartz-manager-app-frontend

# Rebuild and start
cd quartz-manager-backend
mvn clean package -DskipTests
cd ..
docker-compose up -d --build
```

## Development

### Building Backend

```bash
cd quartz-manager-backend
mvn clean package
```

### Building Frontend

```bash
cd quartz-manager-frontend
npm run build
```

### Running Tests

```bash
# Backend
cd quartz-manager-backend
mvn test

# Frontend
cd quartz-manager-frontend
npm test
```

## Environment Variables

### Backend

- `SPRING_DATASOURCE_URL` - Database URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `QUARTZ_HISTORY_RETENTION_DAYS` - History retention period (default: 30)

### Database

- `MYSQL_ROOT_PASSWORD` - MySQL root password
- `MYSQL_DATABASE` - Database name

## Project Structure

```
quartz-manager/
├── quartz-manager-backend/     # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/ppuskar/quartzmanager/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── entity/
│   │       │       ├── repository/
│   │       │       ├── listener/
│   │       │       └── job/
│   │       └── resources/
│   │           ├── application.properties
│   │           └── logback-spring.xml
│   ├── Dockerfile
│   └── pom.xml
├── quartz-manager-frontend/    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobForm.tsx
│   │   │   ├── JobDetails.tsx
│   │   │   ├── JobHistory.tsx
│   │   │   └── TriggerList.tsx
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── types.ts
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

## License

This project is licensed under the **MIT License with Non-Commercial Restriction**.

### Key Points:

- ✅ **Free to use** for personal, educational, and non-commercial purposes
- ✅ **Open source** - you can view, modify, and distribute the code
- ❌ **NOT allowed** for commercial use without explicit permission
- ❌ **Cannot be used** in commercial products or services

See the [LICENSE](LICENSE) file for the full license text.

For commercial licensing inquiries, please contact the project maintainers.

## Contributing

Contributions are welcome! Please note:

1. All contributions must comply with the non-commercial license
2. By contributing, you agree that your contributions will be licensed under the same license
3. Please ensure your code follows the project's coding standards
4. Add license headers to any new source files (see `.license-templates/README.md`)

### How to Contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add license headers to new files (run `.\add-license-headers.ps1`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Support

For issues and questions, please [open an issue](https://github.com/ppuskar/quartz-manager/issues) on GitHub.
