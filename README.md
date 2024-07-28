# Email Transaction Tracker Server

Track expense and income, by automatically fetching and extracting information from gmail inbox.

## Architecture
![ETT drawio](https://github.com/user-attachments/assets/a5a07d19-4152-48c8-aed0-94ada20ee197)


## Prerequisites

- Node.js
- npm
- MongoDB Atlas account

## Installation

1. Clone the repository:  ```git clone https://github.com/sahanmndl/ETT-Backend.git```
2. Navigate to the project directory:  ```cd BackendServer```
3. Install dependencies: ```npm install```
   
## Configuration

1. Go to MongoDB Atlas, and create a new database in a project
2. Create a `.env` file in the root directory and add the following environment variables:

```
MONGODB_URL_PROD =
PORT =
JWT_SECRET_KEY =
JWT_EXPIRY_DURATION =
```

## Usage

To start the server:  ```nodemon index.js```
