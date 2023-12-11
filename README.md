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

....

## API Documentation
The base URL for all endpoints is: `https://localhost:YOUR_PORT/api`

| Endpoint | Method | Auth | Description |
| -------- | ------ | -----| -------- |
| /auth/register | POST | No (auth origins) | Register a new user
| /auth/login | POST | No (auth origins) | Login using email and password
| /auth/logout | POST | No (auth origins) | Logout user (remove cookie)
| /auth/token/refresh | POST | Refresh token | Obtain a new access token
| /users/userID | GET - PATCH - DELETE | Access token | Retrieve, update and delete a user
| /users/userID/parcels | GET - POST | Access token | Retrieve and create user's parcels
| /users/userID/parcels/parcelID | GET- PATCH | Access token | Retrieve and update user's parcel
| /users/userID/nearby-lockers | GET | Access token | Retrieve lockers information near a given user
| /lockers | GET | No (auth origins)| Retrieve lockers' information
| /lockers/lockerID | GET | No (auth origins) | Retrieve detailed information about a locker
| /lockers/lockerID/cabinets | GET - POST | Access token | Retrieve and create cabinets' information
| /lockers/lockerID/cabinets/cabinetID | GET - PATCH | Access token | Retrieve and update cabinet's information



```
API ENDPOINTS designed by Tomoko

USER REGISTER
/api/users/register
Method POST
username, password, email

USER LOGIN
/api/users/login
Method POST
by username and password

USER INFORMATION
/api/users/{userID}
Method GET
Retrieve info by userID


PARCELS
Send a new parcel
/api/parcels/send
Method POST
Users can send a new parcel by sender, recipient, size of parcel and location/destination.

Get parcel info
/api/parcels/{parcelID}
Method GET
Retrieve info by Parcel ID

Update parcel status
/api/parcels/{parcelID}/update
Method PUT
Drivers can update status of parcels. Provide info: delivered.

CABINETS
Cabinet status
/api/cabinets/{cabinetID}
Method GET
Retrieve status by cabinetID

Reserve cabinet
/api/cabinets/{cabinetID}/reserve
Method PUT
Users can reserve a cabinet
```
