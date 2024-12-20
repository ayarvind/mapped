# Mapped
**Mapped** is a URL shortener that simplifies sharing long URLs by creating short, easy-to-use links. It provides a seamless way to share and manage links, offering powerful analytics to track engagement, including click counts, locations, and more. 

Whether you're a blogger, social media influencer, or business owner, Mapped helps you create short links that are easy to share and monitor. Start using Mapped today to optimize your link-sharing experience!

---

## Table of Contents
1. [Features](#features)
2. [Design and Architecture](#design-and-architecture)
3. [Getting Started](#getting-started)
4. [Usage](#usage)

---

## Features
- **User Authentication**: Secure user login with JWT-based token generation.  
- **Rate Limiting**: Prevents misuse by restricting the frequency of requests.  
- **Short Link Management**:
  - Create short links for long URLs and organize them into topics, give them custom aliases if not given it will be auto-generated.
  - Set expiration dates for short links.  
- **Detailed Analytics**:
  - Track total clicks, unique clicks, click locations, and devices.
  - View the last accessed date and time for short links.
  - Analytics available for specific topics, standalone links, or all links combined.
  - Group analytics by operating system, date, or device.  
- **Performance Optimization**:
  - Use Kafka for efficient, scalable event and bulk data collection.
  - Use Redis for caching to improve performance and reduce latency.  



---

## Design and Architecture
**Mapped** is designed as a robust three-tier application using the following components:  

- **Backend**: A Node.js server that manages user authentication, short link creation, and analytics.  
- **Redis**: An in-memory store used for caching and implementing rate limiting.  
- **Kafka**: A distributed event streaming platform for scalable bulk data collection.  


### Flow Overview
1. **User Authentication**: Users log in, and a JWT (JSON Web Token) is generated.  
   - **JWT Structure**:  
     - **Header**: Contains the token type (JWT) and signing algorithm.  
     - **Payload**: Includes user claims.  
     - **Signature**: Ensures sender authenticity and data integrity.  
2. **Short Link Creation and Usage**:  
   - Users can create, organize, and manage short links with expiration dates.  
3. **Accessing a Short Link**:  
   - The system checks Redis cache for the link.  
   - If not found, the database is queried.  
   - Events are logged using Kafka producers during this process.  
   - The response is cached in Redis for future requests.  

### Data Storage and Management
- All data is stored in **PostgreSQL**, managed through **Prisma ORM**.  

### Infrastructure and Deployment
- Fully containerized with **Docker** and orchestrated using **Docker Compose**.  
- Tried to integrate **CI/CD pipeline** implemented using **GitHub Actions** for efficient deployments.  


### Proper Error Handling and Validation
- **Error Handling Middleware**: Centralized error handling is implemented to provide consistent responses across the application. This ensures all errors are captured, and users receive well-structured error messages.

### Rate Limiting Algorithm
- **Sliding Window Rate Limiting**: A **sliding window rate-limiting** algorithm is used to prevent misuse of the application. For each user, this algorithm restricts the number of requests allowed within a specific time frame, ensuring fair use and protecting against excessive traffic.

### Long URL Mapping to Short URL
- The long URL to short URL mapping uses an **auto-incrementing ID** as the primary source for the mapping.
- The auto-incrementing ID is encoded in **Base52** (using a custom alphabet) and used as the short URL.
- Although this method may not be the best choice for distributed systems, it works effectively for single-node database systems. Alternative strategies such as **Universally Unique Identifier (UUID)** or other techniques can also be employed for more scalable and distributed systems.

---

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before getting started, make sure you have the following installed:

- **Docker Desktop**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
  - This will allow you to run containers for the app and related services (such as Redis, Kafka, etc.).
- **Node.js**: [Install Node.js](https://nodejs.org/) (if you plan to run the application locally outside Docker)
- **Git**: [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- **OpenSSL**: [Install OpenSSL](https://www.openssl.org/source/)

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/ayarvind/mapped.git
cd mapped
```
Copy the `.env.example` file to `.env`:

```bash
copy .env.example .env
```
Generate a new secret key for the `JWT_SECRET` field in the `.env` file using openssl:

```bash
openssl rand -base64 32
```
Copy the generated key and paste it in the `.env` file for the `JWT_SECRET` field.

Set the `DATABASE_URL` field in the `.env` file to the PostgreSQL database URL.
SET `NODE_ENV` to `development` .

After editing the .env file, make sure all values are properly configured to reflect your environment.


## Running with Docker Compose
To set up and run the entire project stack with Docker Compose (which includes Node.js, Redis, and Kafka):

Build and start the containers:

```bash
docker-compose up --build
```
This will start all the necessary services defined in the docker-compose.yml file, including:

The Node.js application.
Redis for caching and rate limiting.
Kafka for event streaming and logging.
Once the containers are running, you can access your application locally at `http://localhost:5000` (or any other port you specified).


## Usage

### Authentication Endpoint

- **POST** `/auth`: Authenticates a user and generates a JWT token.
  
  **Request Body**:
  ```json
  {
    "email": "user@example.com",          // User's email
    "name": "John Doe",                   // User's name
    "googleSignInId": "google_uid_here"   // User's Google Sign-In ID (same as UID when logging in with Google)
  }
    ```
- **POST** `/topics`: Creates a new topic for organizing short links.
  
  **Request Body**:
  ```json
  {
    "topicName": "Marketing"   // Name of the topic
  }
  ```
- **GET** `/topics`: Retrieves all topics created by the user.

- **POST** `/shorten`: Creates a short link for a given URL.
  

  **Request Body**:
  ```json
  {
    "longUrl": "https://example.com",   // Long URL to shorten
    "customAlias": "example",           // Custom alias for the short link (optional)
    "expiration": "2024-12-31T23:59:59Z",  // Expiration date and time in ISO 8601 format (optional)
    "topicIds": [                       // List of topic IDs to group the short link (optional)
      "topic_id_1",
      "topic_id_2"
    ]
  }
 ```

- **GET** `/shorten:shortUrl`: Redirects to the original URL for a given short link.

- **GET** `/analytics/:shortUrl`: Retrieves analytics data for a specific short link.
- **GET** `/analytics/overall`: Retrieves analytics data for all short links.

- **GET** `/analytics/:topicName`: Retrieves analytics data for a specific topic.

  




