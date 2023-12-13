# PulssiPosti API

This API provides various endpoints to facilitate user registration, authentication, parcel management, locker information retrieval, and more for the PulssiPosti applications. Below is a comprehensive list of the available endpoints along with their methods, authentication requirements, and brief descriptions.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)

## Requirements

To run and develop this API, ensure that you have the following previously installed:

- **Node.js:** Version 20. You can download it [here](https://nodejs.org/), or using you prefered node version manager.
  - _Note_: The API has been developed and tested with Node.js version 20, but it should work with version 18 as well.

- **PostgreSQL:** Version 15^. This API relies on PostgreSQL as its relational database.
  - _Note_: Make sure to set up a PostgreSQL database and update the connection details in the .env file. You can use the provided .env.example as a template.

## Installation
To use this API locally, follow these steps:

1. Clone the repository and move into the project's directory: 
```sh
  git clone https://github.com/Project-Parcel-Locker-App/api
  cd api/
```
2. Install the dependencies:
 ```sh
  npm install
```
4. Rename the **example.env** file to **.env**, then replace variable placeholders with the correct values for your application.

5. Run the dev server:
 ```sh
  npm run dev
```

## Usage

| Endpoint | Minimum payload required (JSON)|
| -------- | --------------------- |
| /auth/register | `{ "firstName": "Klaus", "lastName": "Walker", "email": "your-email@example.com", "phoneNumber": "+358789456123", "userRole": "consumer", "street": "Isokatu 33", "zipCode": "90100", "city": "Oulu", "country": "Finland", "password": "passwordexample", "passwordConfirm": "passwordexample" }`
| /auth/login | `{ "email": "your-email@somehost.com", "password": "password1234" }`
| /auth/token/refresh | Refresh token in the authorization header or as cookie
| /users/userID/parcels | `{ "parcel": { "parcel_weight": 11.5, "special_instructions": "Fragile", "parcel_size": "L" },	"recipient_email": "james.bond@consumer.com" }`
| /parcels/parcelID | `{ "parcel": { "parcel_status": "pending" } }`
| /parcels/code | `{ "parcel_code": "6989" }`
| /parcels/generator | No payload required

_Note:_ See the methods allowed by these endpoints below

## API Documentation
The base URL for all endpoints is: `https://localhost:YOUR_PORT/api`

<details>
  <summary>Credits</summary>
  The following API endpoints were designed by Tomoko and Yerold
</details>

| Endpoint | Method | Auth | Description |
| -------- | ------ | -----| ----------- |
| /auth/register | POST | No (auth origins) | Register a new user
| /auth/login | POST | No (auth origins) | Login using email and password
| /auth/logout | POST | No (auth origins) | Logout user (remove cookie)
| /auth/token/refresh | POST | Refresh token | Obtain a new access token
| /users/userID | GET - PATCH - DELETE | Access token | Retrieve, update and delete a user
| /users/userID/parcels | GET - POST | Access token | Retrieve and create user's parcels
| /users/userID/parcels/parcelID | GET | Access token | Retrieve user's parcel
| /users/userID/nearby-lockers | GET | Access token | Retrieve lockers information near a given user
| /lockers | GET | No (auth origins)| Retrieve lockers' information
| /lockers/lockerID | GET | No (auth origins) | Retrieve detailed information about a locker
| /lockers/lockerID/cabinets | GET - POST | Access token | Retrieve and create cabinets' information
| /lockers/lockerID/cabinets/cabinetID | GET - PATCH | Access token | Retrieve and update cabinet's information
| /parcels/parcelID | GET - PATCH | Access token | Retrieve, update and delete a user
| /parcels/code | POST | No (auth origins) | Retrieve parcel's information by pickup or delivery(sending) code
| /parcels/generator | POST | No (auth origins) | Create random parcels for registered users
