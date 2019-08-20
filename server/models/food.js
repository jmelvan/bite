const mongoose = require('mongoose');

const { Schema } = mongoose;

//Single meal schema
const FoodSchema = new Schema({
  catering_id: String,
  name: String,
  price: Number,
  type: String,
  calories: Number
});

FoodSchema.methods.asignCatering = function(catering_id) {
  this.catering_id = catering_id;
}

mongoose.model('Food', FoodSchema);
const Food = mongoose.model('Food');

//Menus schema
const MenusSchema = new Schema({
  catering_id: String,
  food_list: Array,
  name: String,
  price: Number
});

MenusSchema.methods.asignCatering = function(catering_id){
  this.catering_id = catering_id;
}

MenusSchema.methods.calculatePrice = function(food_list){
  var that = this;
  return new Promise((resolve) => {
    var mealIds = [], finalPrice = 0;
    food_list.map((meal) => {
      mealIds.push(meal._id);
    });
    Food.find({_id: { $in : mealIds }}, function(err, food){
      food.map((meal) => {
        finalPrice += meal.price;
      });
      that.price = finalPrice;
      resolve(true);
    });
  });
}

mongoose.model('Menus', MenusSchema);