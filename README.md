# Life Insurance Recommendation API

A robust NestJS-based REST API for generating personalized life insurance recommendations with comprehensive logging, monitoring, and security features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with Passport.js
- **Database**: PostgreSQL with Prisma ORM
- **Logging**: Winston-based logging with file rotation
- **Monitoring**: Health checks, metrics, and performance monitoring
- **Security**: Helmet, rate limiting, CORS protection
- **Documentation**: Swagger/OpenAPI documentation
- **Docker**: Multi-stage Docker builds with security best practices
- **Testing**: Jest-based unit and e2e tests

## 📋 Prerequisites

- Node.js 18+ 
- Yarn package manager
- PostgreSQL 15+
- Docker & Docker Compose (for containerized deployment)

## 🛠️ Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd life_insurance_be
yarn install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Application Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/life_insurance"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Logging Configuration
LOG_LEVEL=info

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Database Setup

```bash
# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate

# (Optional) Open Prisma Studio for database management
yarn prisma:studio
```

### 4. Start Development Server

```bash
# Development mode with hot reload
yarn start:dev

# Production mode
yarn start:prod

# Debug mode
yarn start:debug
```

The API will be available at `http://localhost:3001`

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Start all services (app, database, redis)
yarn docker:compose

# Stop all services
yarn docker:compose:down

# View logs
docker-compose logs -f app
```

### Manual Docker Build

```bash
# Build the Docker image
yarn docker:build

# Run the container
yarn docker:run
```

### Docker Compose Services

- **app**: NestJS application (port 3001)
- **db**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)

## 📊 Monitoring & Health Checks

### Health Check Endpoints

- **Health Check**: `GET /monitoring/health`
- **Readiness Probe**: `GET /monitoring/ready`
- **Metrics**: `GET /monitoring/metrics`

### Example Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": {
    "value": 3600000,
    "formatted": "1h 0m 0s"
  },
  "memory": {
    "used": 52428800,
    "total": 1073741824,
    "percentage": 4.88
  },
  "requests": {
    "total": 150,
    "successRate": 98.67
  }
}
```

## 🔒 Security Features

### Rate Limiting
- **Per-minute limit**: 100 requests
- **Per-hour limit**: 1000 requests
- Configurable via environment variables

### Security Headers
- Helmet.js for security headers
- CORS protection with configurable origins
- Request validation and sanitization

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Configurable token expiration

## 📝 API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:3001/api
```

### Available Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

#### Recommendations
- `POST /recommendations` - Generate insurance recommendations (protected)
- `GET /recommendations/history` - Get recommendation history (protected)

#### Monitoring
- `GET /monitoring/health` - Health check
- `GET /monitoring/metrics` - Application metrics
- `GET /monitoring/ready` - Readiness probe

## 📈 Logging

### Log Levels
- `error`: Application errors
- `warn`: Warning messages
- `info`: General information
- `debug`: Debug information
- `verbose`: Verbose logging

### Log Files
- **Application logs**: `logs/application-YYYY-MM-DD.log`
- **Error logs**: `logs/error-YYYY-MM-DD.log`
- **Log rotation**: Daily with 14-day retention
- **Compression**: Automatic gzip compression

### Log Format
```json
{
  "level": "info",
  "message": "Incoming GET request to /monitoring/health from 127.0.0.1",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "context": "RequestLogger",
  "service": "life-insurance-api"
}
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# Unit tests with coverage
yarn test:cov

# E2E tests
yarn test:e2e

# Test in watch mode
yarn test:watch
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-very-long-and-secure-jwt-secret
LOG_LEVEL=warn
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

### Docker Production Deployment

```bash
# Build production image
docker build -t life-insurance-be:latest .

# Run with production environment
docker run -d \
  --name life-insurance-api \
  -p 3001:3001 \
  --env-file .env.production \
  -v /path/to/logs:/app/logs \
  life-insurance-be:latest
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: life-insurance-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: life-insurance-api
  template:
    metadata:
      labels:
        app: life-insurance-api
    spec:
      containers:
      - name: api
        image: life-insurance-be:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        livenessProbe:
          httpGet:
            path: /monitoring/health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /monitoring/ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Verify connection string
   psql "postgresql://postgres:password@localhost:5432/life_insurance"
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 3001
   lsof -i :3001
   
   # Kill the process
   kill -9 <PID>
   ```

3. **Permission Denied for Logs**
   ```bash
   # Create logs directory with proper permissions
   mkdir -p logs && chmod 755 logs
   ```

### Log Analysis

```bash
# View recent application logs
tail -f logs/application-$(date +%Y-%m-%d).log

# View error logs
tail -f logs/error-$(date +%Y-%m-%d).log

# Search for specific errors
grep "ERROR" logs/error-*.log
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
