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

Login data for **Catering**:
> melvan

> test123

Login data for **Client**:
> melvan2

> test123

### How to use app

Firstly, you have to login to client dashboard to create new token. After login navigate to **Tokens** section using menu on the left side.
There are already supposed to be 2 created tokens so you can use any of them.

Tokens are used to order food from [main page](http://on-time.cc:3000). Enter token on the main page at right side of navbar. After you successfully enter token, you should be able to make orders (check order buttons at the bottom of listed menus).

After successfully ordering, you would get server response as alert to know exact status of your token. Created order would show up inside **Catering dashboard**. Inside catering dashboard you can manage order status (pending, confirmed, ready). 

Once the order is delivered, deliverer would check the order inside his app and order status would change to **delivered** (feature not available yet).

For any questions about app features and usages feel free to contact me: [+385 98 851 276]()

### Upgrades/Ideas:
  - After logging in using token on main page, show **Order button** only if token is not used or food menu price is not higher than token allowes. 
  - After deliverer gets his orders to deliver, alorithm should calculate fastest and simplest drive route using google api and create navigation for deliverer. *(know how, but don't have enough time to make this + must be native app to allow location tracking)* 

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