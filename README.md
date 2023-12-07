# PulssiPosti Backend API

### Prerequisites

- Node.js ^18
- PostgreSQL ^15 (if any other relational database is used, change the db.sql file accordingly)

### Start working
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
4. Rename the **sample.env** file to **.env**, then replace variable placeholders with the correct values for your application.

5. Run the dev server:
 ```sh
  npm run dev
```

## API Endpoints
The base URL for all endpoints is: `https://localhost:PORT/api/`

| Endpoint | Method | Auth | Description |
| -------- | ------ | -----| -------- |
| /auth/login | POST | No (auth origins) | Login using email and password 
| /auth/logout | POST | Access token | Logout user (remove cookie)
| /auth/token/refresh | POST | Refresh token | Obtain a new access token
| /users/register | POST | No (auth origins) | Register a new user
| /users/userID | GET - PATCH - DELETE | Access token | Retrieve, update and delete user by ID
| /users/userID/parcels | GET - POST | Access token | Retrieve and create user's parcels
| /users/userID/parcels/parcelID | GET | Access token | Retrieve user's parcel by ID
| /users/userID/nearby-lockers | GET | Access token | Retrieve lockers information near the user
| /lockers | GET | No (auth origins)| Retrieve lockers' information
| /lockers/lockerID | GET | No (auth origins) | Retrieve detailed information about a locker
| /lockers/lockerID/cabinets | GET - POST | Access token | Retrieve and create cabinets' information
| /lockers/lockerID/cabinets/cabinetID | GET - PATCH | Access token | Retrieve and update cabinet by ID



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
