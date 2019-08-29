const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const UsedTokens = mongoose.model('Used_tokens');
const Orders = mongoose.model('Orders');
const crypto = require('crypto');

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
        return res.status(422).json({error: "The email has already been used"});
      } else if(user.username == userIn.username){
        return res.status(422).json({error: "The username already exist"});
      }
    }
  })
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.username) {
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

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json(user.toAuthJSON());
    }

    return res.status(400).json(info);
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
        Orders.find({renter_id: id, token: req.params.token}, {'_id': 0,'food_list': 1, 'price': 1, 'token': 1, 'catering_id': 1, 'time': 1, 'status': 1}, {sort: {'time': -1}}, function(err, orders) {
          res.json({orders: orders});
        })
      :
        Orders.find({renter_id: id}, {'_id': 0,'food_list': 1, 'price': 1, 'token': 1, 'catering_id': 1, 'time': 1, 'status': 1}, {sort: {'time': -1}}, function(err, orders) {
          res.json({orders: orders});
        })
    }
  })
});

//GET deliverers - catering only
router.get('/deliverers', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      Users.find({catering_id: id, role: "deliverer"}, (err, deliverers) => {
        res.json({deliverers: deliverers});
      })
    } else {
      res.status(422).json({error: "Please stop hacking!! :)"});
    }
  });
});

//POST new deliverer - catering only
router.post('/deliverers/add', auth.required, (req, res, next) => {
  const { payload: { id }, body: { user } } = req;

  Users.findOne({$or: [
    {username: user.username},
    {name: user.name}
  ], role: "deliverer"}).then((userIn) => {
    if(!userIn){

      const finalUser = new Users(user);

      finalUser.setPassword(user.password);
      finalUser.setCatering_id(id);

      return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));

    } else {
      if(user.name == userIn.name){
        return res.status(422).json({error: "Display name has already been used"});
      } else if(user.username == userIn.username){
        return res.status(422).json({error: "The username already exist"});
      }
    }
  })
});

//POST update deliverer - catering only
router.post('/deliverers/update', auth.required, (req, res, next) => {
  const { payload: { id }, body: { user } } = req;

  if(user.password){
    var salt = crypto.randomBytes(16).toString('hex');
    var upd = {
      username: user.username,
      name: user.name, 
      salt: salt,
      hash: crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
    }
  } else {
    var upd = {
      username: user.username,
      name: user.name
    }
  }

  Users.findOneAndUpdate({catering_id: id, _id: user._id}, upd, function(err, deliverer){
    res.json({deliverer: deliverer});
  })
});

//POST delete deliverer - catering only
router.post('/deliverers/remove/:id', auth.required, (req, res, next) => {
  const { payload: { id }, body: { user } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      Users.deleteOne({_id: req.params.id}, function(err){
        if(err) return res.json({error: err});
        return res.json({success: "You have successfully removed deliverer from your list"});
      });
    }
  })
});

router.use('/tokens', require('./tokens'));
router.use('/food', require('./food'));

module.exports = router;