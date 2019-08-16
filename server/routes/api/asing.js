const mongoose = require('mongoose');
const UsedTokens = mongoose.model('Used_tokens');
const Orders = mongoose.model('Orders');
asign_oneUsedToken = (food, token) => {
  return new Promise((resolve) => {
    const usedOne = new UsedTokens(food);
        usedOne.setDate();
        usedOne.setRenter(token.renter_id);
        usedOne.tokenID(token._id);
        usedOne.forToken(token.token);
      
    resolve(usedOne);
  })
}

makeOrder = (food, token) => {
  return new Promise((resolve) => {
    const order = new Orders(food);
      order.asignTokenData(token);
      order.setStatus("pending");
      order.setDate();
      order.setPrice(food.food_list).then(() => {
        order.save().then(() => {
          resolve(true);
        })
      });
  });
}