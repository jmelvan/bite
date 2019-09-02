const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const crypto = require('crypto');
const Tokens = mongoose.model('Tokens');

//GET user tokens
router.get('/', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  Tokens.find({renter_id: id}, function(err, tokens) {
    res.json({tokens: tokens});
  });
});

//POST - Asign new token for user
router.post('/add', auth.required, (req, res, next) => {
  const { payload: { id }, body: { token } } = req;

  /*if(!token.valid_start_time || !token.end_time) {
    return res.status(422).json({
      errors: {
        date: 'is required',
      },
    });
  }*/

  const finalToken = new Tokens(token);

  finalToken.createToken();
  finalToken.setRenter(id);

  return finalToken.save().then(() => res.json({success: "You have successfully added one token."}));
});

//POST - Delete existing token
router.post('/remove/:token', auth.required, (req, res, next) => {
  const { payload: { id }, body: { token } } = req;

  Tokens.deleteOne({_id: req.params.token, renter_id: id}, function(err){
    if (err) return res.json({error: err});
    return res.json({success: "You have successfully removed one token."});
  })
});

//POST - login with token
router.post('/login/:token', auth.optional, (req, res, next) => {
  Tokens.findOne({token: req.params.token}, function(err, token){
    return res.json({token: token});
  })
});

//POST update token - client only
router.post('/update', auth.required, (req, res, next) => {
  const { payload: { id }, body: { token } } = req;

  if(token.allowed_uses && !token.max_price){
    var upd = {
      allowed_uses: token.allowed_uses,
      delivery_location: token.delivery_location
    }
  } else if(!token.allowed_uses && token.max_price){
    var upd = {
      max_price: token.max_price,
      delivery_location: token.delivery_location
    }
  } else if(token.allowed_uses && token.max_price){
    var upd = {
      allowed_uses: token.allowed_uses,
      max_price: token.max_price,
      delivery_location: token.delivery_location
    }
  }
    
  Tokens.findOneAndUpdate({renter_id: id, _id: token._id}, upd, function(err, token){
    res.json({token: token});
  })
});

//Fetch asign functions
require('./asing');

//POST - Order food - Add order to used tokens after using token and increment number of uses for specific token
router.post('/use/:token', auth.required, (req, res, next) => {
  const { payload: { id }, body: { food } } = req;
  var forsignature = "", secret = "mieY91IQCTkPWHugLv4ZlZORyT1GtsDF";
  food.food_list.map((meal) => {
    forsignature += meal.name + meal.price;
  });
  const signature = crypto.pbkdf2Sync(forsignature, secret, 10000, 512, 'sha512').toString('hex');
  if(signature === food.signature){
    Tokens.findOneAndUpdate({token: req.params.token, renter_id: id}, {
      $inc: {number_of_uses: 1} 
    }, function(err, token){
      if (err) {
        return res.json({error: err});
      } else {
        if((token.number_of_uses < token.allowed_uses || (!token.number_of_uses && token.allowed_uses != undefined)) && !token.max_price){
          asign_oneUsedToken(food, token).then((usedOne) => {
            usedOne.totalPrice(food.food_list);
            usedOne.save().then(() => {
              makeOrder(food, token).then(() => {
                return res.json({success: "You can use this token "+(token.allowed_uses-(token.number_of_uses ? token.number_of_uses : 0)-1)+" more times."});
              });
            });
          });
        } else if((token.total_price < token.max_price || !token.total_price) && (!token.allowed_uses || (!token.number_of_uses ? 0 : token.number_of_uses) < token.allowed_uses)){
          asign_oneUsedToken(food, token).then((usedOne) => {
            usedOne.totalPrice(food.food_list).then((spent_now) => {
              var total_new = (!token.total_price ? 0 : token.total_price) + spent_now;
              if(total_new <= token.max_price){
                Tokens.update({token: req.params.token, renter_id: id}, {total_price: total_new}, function(err){
                  usedOne.save().then(() => {
                    makeOrder(food, token).then(() => {
                      return !token.allowed_uses ?
                      res.json({success: "You have "+(token.max_price-spent_now-(!token.total_price ? 0 : token.total_price))+" kn available to spend"})
                      :
                      res.json({success: "You have "+(token.max_price-total_new)+" kn available to spend within "+(token.allowed_uses-(token.number_of_uses ? token.number_of_uses : 0)-1)+" more orders."})
                    });
                  });
                });
              } else {
                return res.json({error: "You can spend only "+(token.max_price-(!token.total_price ? 0 : token.total_price))+" kn while you're trying to spend "+(total_new-token.total_price)+" kn."})
              }
            });
          });
        } else {
          if(token.allowed_uses != undefined && !token.max_price){
            return res.json({error: "You have exceeded maximum allowed uses of token."});
          } else if(!token.allowed_uses && !token.max_price != undefined){
            return res.json({error: "You have spent all available money on this token"});
          } else {
            return res.json({error: "You have exceeded maximum allowed uses of token."});
          }
        }
      }
    })
  } else {
    return res.json({error: "Stop hacking!!!"});
  }
});

module.exports = router;