# NestJS Queue Example with BullMQ and Redis

## Overview

This project is a practical example of integrating **BullMQ** with **Redis** in a **NestJS** application to handle background tasks efficiently. It demonstrates how to process requests asynchronously, ensuring that the Node.js event loop remains unblocked. Specifically, it implements an email verification feature where user requests trigger background jobs to send verification emails, showcasing the power of queue-based task processing for improved performance and scalability.

In modern web applications, blocking operations like sending emails can degrade user experience and system responsiveness. By leveraging BullMQ, a fast and reliable queue library for Node.js, this app offloads such tasks to background workers, allowing the main application thread to handle incoming requests swiftly.

## Features

- **Asynchronous Email Verification**: Users can initiate email verification requests that are queued and processed in the background.
- **Non-Blocking Operations**: Demonstrates how BullMQ prevents the Node.js event loop from being blocked by I/O-bound tasks.
- **Modular Architecture**: Organized into auth and mail modules for clean separation of concerns.
- **Redis Integration**: Uses Redis as the queue backend for persistence and reliability.
- **Docker Support**: Includes Docker Compose for easy Redis setup.
- **Testing**: Includes unit and e2e tests using Jest.

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **BullMQ**: A Node.js library for handling distributed jobs and messages with Redis.
- **Redis**: An in-memory data structure store used as a database, cache, and message broker.
- **Nodemailer**: A module for Node.js applications to allow easy email sending.
- **TypeScript**: For type-safe development.
- **Docker**: For containerized Redis instance.
- **PNPM**: As the package manager for faster and more efficient dependency management.

## Prerequisites

- Node.js (v16 or higher)
- PNPM
- Docker and Docker Compose

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nestjs-queue-example.git
   cd nestjs-queue-example
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start Redis using Docker Compose**:
   ```bash
   docker-compose up -d
   ```

4. **Run the application**:
   ```bash
   pnpm start:dev
   ```

The app will be running on `http://localhost:3000`.

## Usage

### Email Verification Flow

1. **Trigger Email Verification**:
   - Send a POST request to `/auth/verify-email` with the required payload (e.g., user email).
   - This adds a job to the BullMQ queue.

2. **Background Processing**:
   - The `EmailBackgroundWorker` processes the job asynchronously.
   - It uses the `MailService` to send the verification email.
   - The main event loop remains free to handle other requests.

### API Endpoints

- `POST /auth/verify-email`: Initiates email verification (queues the job).

### Example Request

```bash
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com","username":"username"}'
```

## Architecture

- **Modules**:
  - `AuthModule`: Handles authentication-related logic, including queuing email verification jobs.
  - `MailModule`: Provides email sending services using Nodemailer.
  - `Tasks`: Contains the background worker (`EmailBackgroundWorker`) that consumes jobs from the queue.

- **Queue Mechanism**:
  - Jobs are added to a BullMQ queue in the auth controller.
  - The worker listens for jobs and executes them, sending emails using Nodemailer via the MailService.

- **Benefits**:
  - **Scalability**: Easily scale workers horizontally.
  - **Reliability**: Jobs are persisted in Redis, surviving app restarts.
  - **Performance**: Offloads heavy tasks, keeping the API responsive.

## Testing

Run the tests:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## Building for Production

```bash
pnpm build
pnpm start:prod
```

## Configuration

- Redis connection is configured in the BullMQ setup (check `src/tasks/email-background-worker.ts`).
- Environment variables can be added for email service credentials, Redis host, etc.