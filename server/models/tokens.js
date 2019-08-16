const mongoose = require('mongoose');

const { Schema } = mongoose;

//Created tokens schema
const TokensSchema = new Schema({
  renter_id: String,
  delivery_location: JSON,
  valid_start_time: Date,
  end_time: Date,
  allowed_uses: Number,
  number_of_uses: Number,
  max_price: Number,
  total_price: Number,
  token: String
});

TokensSchema.methods.createToken = function(){
  this.token = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
};

TokensSchema.methods.setRenter = function(renter){
  this.renter_id = renter;
};

mongoose.model('Tokens', TokensSchema);

//Used tokens schema
const UsedTokensSchema = new Schema({
  catering_id: String,
  renter_id: String,
  token_id: String,
  token: String,
  food_list: Array,
  price: Number,
  time: Date,
});

UsedTokensSchema.methods.setDate = function(){
  this.time = new Date();
};

UsedTokensSchema.methods.setRenter = function(renter){
  this.renter_id = renter;
};

UsedTokensSchema.methods.tokenID = function(tokenID){
  this.token_id = tokenID;
};

UsedTokensSchema.methods.forToken = function(token){
  this.token = token;
};

UsedTokensSchema.methods.totalPrice = function(food_list){
  return new Promise((resolve, reject) => {
    var totalPrice = 0;
    food_list.map((meal) => {
      totalPrice += meal.price;
    });
    this.price = totalPrice;
    resolve(totalPrice);
  })
};

mongoose.model('Used_tokens', UsedTokensSchema);