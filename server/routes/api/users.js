const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const UsedTokens = mongoose.model('Used_tokens');
const Orders = mongoose.model('Orders');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.username){
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  Users.findOne({$or: [
    {email: user.email},
    {username: user.username}
  ]}).then((userIn) => {
    if(!userIn){

      const finalUser = new Users(user);

      finalUser.setPassword(user.password);

      return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));

    } else {
      if(user.email == userIn.email){
        return res.json({error: "The email has already been used"});
      } else if(user.username == userIn.username){
        return res.json({error: "The username already exist"});
      }
    }
  })
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

router.get('/orders/:token*?', auth.required, (req, res, next) => {
  const {payload: {id}} = req;
  Users.findOne({_id: id}, function(err, user){
    if(user.role == "catering"){
      Orders.find({catering_id: id}, {'_id': 0, 'catering_id': 0, 'renter_id': 0, '__v': 0}, function(err, orders) {
        res.json({orders: orders});
      });
    } else if(user.role == "client") {
      req.params.token ?
        UsedTokens.find({renter_id: id, token: req.params.token}, {'_id': 0,'food_list': 1, 'price': 1, 'token': 1, 'catering_id': 1, 'time': 1}, function(err, orders) {
          res.json({orders: orders});
        })
      :
        UsedTokens.find({renter_id: id}, {'_id': 0,'food_list': 1, 'price': 1, 'token': 1, 'catering_id': 1, 'time': 1}, function(err, orders) {
          res.json({orders: orders});
        })
    }
  })
});

router.use('/tokens', require('./tokens'));
router.use('/food', require('./food'));

module.exports = router;