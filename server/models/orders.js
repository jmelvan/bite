const mongoose = require('mongoose');

const { Schema } = mongoose;

//Created tokens schema
const OrdersSchema = new Schema({
  catering_id: String,
  renter_id: String,
  delivery_location: JSON,
  food_list: Array,
  time: Date,
  price: Number,
  token: String,
  status: String,
  deliverer: String,
  deliverer_id: String
});

OrdersSchema.methods.asignTokenData = function(token){
  this.renter_id = token.renter_id;
  this.token = token.token;
  this.delivery_location = token.delivery_location
};

OrdersSchema.methods.setDate = function(){
  this.time = new Date();
};

OrdersSchema.methods.setStatus = function(status){
  this.status = status;
};

OrdersSchema.methods.setPrice = function(food_list){
  return new Promise((resolve, reject) => {
    var totalPrice = 0;
    food_list.map((meal) => {
      totalPrice += meal.price;
    });
    this.price = totalPrice;
    resolve(totalPrice);
  })
};

mongoose.model('Orders', OrdersSchema);