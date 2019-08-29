const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Food = mongoose.model('Food');
const Menus = mongoose.model('Menus');
const Users = mongoose.model('Users');

//GET catering food
router.get('/', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      Food.find({catering_id: user._id}, {'__v': 0, 'catering_id': 0}, function(err, food){
        res.json({meals: food});
      })
    }
  });
});

//POST add meal to food list - only catering
router.post('/add', auth.required, (req, res, next) => {
  const { payload: { id }, body: { meal } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      const Meal = new Food(meal);
      
      Meal.asignCatering(id);
      Meal.save().then(() => {
        res.json({success: "You have successfully added one meal"});
      })
    }
  })
});

//POST remove meal from food list - only catering
router.post('/remove/:id', auth.required, (req, res, next) => {
  const { payload: { id }, body: { meal } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      Food.deleteOne({_id: req.params.id}, function(err){
        if(err) return res.json({error: err});
        return res.json({success: "You have successfully removed meal from your list"});
      });
    }
  })
});

//POST search meal from meal list
router.post('/search', auth.required, (req, res, next) => {
  const { payload: { id }, body: { q } } = req;

  Food.find({catering_id: id, name: {$regex: q}}, function(err, meals){
    res.json({meals: meals});
  })
});

//GET catering menus
router.get('/menus', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      Menus.find({catering_id: user._id}, {'__v': 0, 'catering_id': 0}, function(err, menu){
        res.json({menus: menu});
      });
    }
  });
});

//POST update menus from menus list
router.post('/menus/update', auth.required, (req, res, next) => {
  const { payload: { id }, body: { menu } } = req;

  Menus.findOneAndUpdate({catering_id: id, _id: menu._id}, {food_list: menu.food_list, name: menu.name, price: menu.price}, function(err, menu){
    res.json({menu: menu});
  })
});

//POST add catering menu
router.post('/menus/add', auth.required, (req, res, next) => {
  const { payload: { id }, body: { menu } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      const Menu = new Menus(menu);
      Menu.asignCatering(id);
      !menu.price ? 
        Menu.calculatePrice(menu.food_list).then(() => {
          Menu.save().then(() => {
            res.json({success: "You have successfully created '"+menu.name+"' menu"});
          });
        }) 
      : 
        Menu.save().then(() => {
          res.json({success: "You have successfully created '"+menu.name+"' menu"});
        })
    }
  })
});


//POST remove catering menu
router.post('/menus/remove/:id', auth.required, (req, res, next) => {
  const { payload: { id }, body: { menu } } = req;

  Users.findOne({_id: id}, function(err, user){
    if(user.role === "catering"){
      Menus.deleteOne({_id: req.params.id}, function(err){
        if(err) return res.json({error: err});
        return res.json({success: "You have successfully removed menu from your list"});
      });
    }
  })
});


module.exports = router;