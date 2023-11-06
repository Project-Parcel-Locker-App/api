# PulssiPosti Backend API

## Start working
Clone the project and install depencies
`npm install`

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
