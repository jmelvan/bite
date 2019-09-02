# Bite

## Summercamp 2019

### How to run Bite

Firstly clone this repo using 
```
git clone https://github.com/jmelvan/bite.git
```

To run server navigate to server folder inside repo and execute following commands:
```
npm install
node app.js
```

To run client app, navigate to client folder inside repo and execute following commands:
```
npm install
npm start
```

Client app is running on port **:3000** while server is splited on ports **:8000** for api, and **:3001** for realtime using Socket.io

### Deployed app

To test app please use the following [link](http://on-time.cc:3000).

To enter dashboards click [here](http://on-time.cc:3000/login).

### Database structure and variables
```
{
 "database": {
    "users":  {
      "_id": "default",
      "email": "email",
      "username": "String",
      "salt": "Secret",
      "hash": "Hash",
      "role": "String (catering/renter/deliverer)",
      "catering_id": "users._id (for deliverer)",
      "name": "String (for deliverer)"
    },
    "menus":  {
      "_id": "default",
      "catering_id": "users._id",
      "food_list": "Array({id: food._id, name: food.name})",
      "name": "String",
      "price": "number"
    },
    "food": {
      "_id": "default",
      "catering_id": "users._id",
      "name": "String",
      "type": "String",
      "calories": "Number",
      "price": "Number"
    },
    "tokens": {
      "_id": "default",
      "renter_id": "users._id",
      "delivery_location": "geocoordinates",
      "valid_start_time": "date and time",
      "end_time": "date and time",
      "allowed_uses": "number",
      "max_price": "number",
      "number_of_uses": "number",
      "total_price": "number",
      "token": "token"
    },
    "used_tokens":  {
      "_id": "default",
      "catering_id": "users._id",
      "token_id": "tokens._id",
      "food_list": "Array(food._id)",
      "price": "number",
      "time": "date and time"
    },
    "orders": {
      "_id": "default",
      "catering_id": "users._id",
      "renter_id": "users._id",
      "delivery_location": "geocoordinates",
      "food_list": "Array({id: food._id, name: food.name})",
      "time": "date and time",
      "token": "token",
      "price": "number",
      "status": "String",
      "deliverer": "user.name (deliverer)",
      "deliverer_id": "user._id (deliverer)"
    }
  },
  "variables": {
    "status": [
      "pending",
      "confirmed",
      "ready",
      "delivered"
    ]
  }
}
```