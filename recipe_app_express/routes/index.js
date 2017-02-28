var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CookBook' });
});

/* GET menu page. */
router.get('/menu', function(req, res, next) {
  res.render('menu', { title: 'Menu' });
});

/* GET recipe page. */
router.get('/recipes', function(req, res, next) {
  res.render('recipes', { title: 'Recipes' });
});

/* GET shopping list page. */
router.get('/shoppinglist', function(req, res, next) {
  res.render('shoppinglist', { title: 'Shopping List' });
});




module.exports = router;
