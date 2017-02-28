$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    
  // Initialize all variables that will be used
  var dinners = [];
  var lunches = [];
  var snacks = [];
  var breakfasts = [];
  var desserts = [];
  
  var mealTypeEnum = {
    breakfast: '1',
    lunch: '2',
    dinner: '3',
    snack: '4',
    dessert: '5'
  }
    
    // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDzN2pLq28MXI-ZloJcIp9iUTbhdaUOVRw",
        authDomain: "recipesaver-c7f4d.firebaseapp.com",
        databaseURL: "https://recipesaver-c7f4d.firebaseio.com",
        storageBucket: "recipesaver-c7f4d.appspot.com",
        messagingSenderId: "163762066965"
      };
      firebase.initializeApp(config);
     // Get a reference to the database service
    var database = firebase.database();
    var ingredients;
    
  var database = firebase.database();
  // var userId = firebase.auth().currentUser.uid;
  var userId = "LSJipcKH0URTIuDUkGNZNoe34Lb2";
  var recipesRef = firebase.database().ref('/users/' + userId + '/recipes');
  
  // Getting all recipes and putting them in the right list
  recipesRef.once('value').then(function(snapshot) {
  var recipes = snapshot.val();
  for (key in recipes){
    switch (recipes[key].type){
      case mealTypeEnum.breakfast:
        breakfasts.push(recipes[key]);
        break;
      case mealTypeEnum.lunch:
        lunches.push(recipes[key]);
        break;
      case mealTypeEnum.dinner:
        dinners.push(recipes[key]);
        break;
      case mealTypeEnum.snack:
        snacks.push(recipes[key]);
        break;
      case mealTypeEnum.dessert:
        desserts.push(recipes[key]);
        break;
    }
  }
  console.log(breakfasts);
  console.log(lunches);
  console.log(dinners);
  //Insert recipes into the html doc
  console.log('these are the dinners', dinners);
  console.log(dinners.length);
  for (var i = 0; i < dinners.length; i++){
    addRecipeCard(dinners[i]);
}
  });
    
    
        
function ingredientForDB(name, qty, unit){
  var self = this;
  self.name = name;
  self.qty = qty;
  self.unit = unit;
  
}

var addRecipeCard = function(recipe_obj){
  var recipe_obj_image = ''; // set to default if no image in recipe_obj
  var html = 
    '<div class="col s12 m7">' +
    '<h2 class="header">' + recipe_obj.name + '</h2>' +
    '<div class="card horizontal">' +
      '<div class="card-image">' +
        //'<img src=' + recipe_obj_image +'>' + // add image url here
      '</div>' +
      '<div class="card-stacked">' +
        '<div class="card-content">' +
          '<p>' + recipe_obj.directions +'</p>' +
        '</div>' +
        '<div class="card-action">' +
          '<a href="#">View</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>'
  $('#container').append(html);
  console.log(html);
}
    
// Class to represent a row in the ingredients
function Ingredient(name, qty, unit) {
    var self = this;
    self.name = ko.observable(name);
    self.qty = ko.observable(qty);
    self.unit = ko.observable(unit);

    //self.formattedPrice = ko.computed(function() {
      //  var price = self.meal().price;
        //return price ? "$" + price.toFixed(2) : "None";        
    //});    
}

// Overall viewmodel for this screen, along with initial state
function IngredientsViewModel() {
    var self = this;
    self.name = "indredients";

    // Non-editable catalog data - would come from the server
    self.availableUnits = [
        { name: "NA"},
        { name: "Cup"},
        { name: "Quart"},
        { name: "Gallon"},
        { name: "Pint"},
        { name: "Tablespoon"},
        { name: "Teaspoon"},
        { name: "Pound"},
        { name: "Can"},
        { name: "Blah"},
       
    ];    

    // Editable data
    self.ingredients = ko.observableArray([
        new Ingredient("", "", ""),
        new Ingredient("", "", ""),
        new Ingredient("", "", ""),
        new Ingredient("", "", ""),
        new Ingredient("", "", ""),
        new Ingredient("", "", "")
    ]);

    // Operations
    self.addIngredient = function() {
        self.ingredients.push(new Ingredient("", "", ""));
        //print ingredients to console
        var i = 0;
       for (ingredient in self.ingredients()){
           var ing = self.ingredients()[ingredient].name();
           if (ing != ''){
             return
            //console.log(ing);
           }
        }
    }
    
     ingredients = ko.computed(function() {
       var ingredientsForDB = [];
       for (ingred in self.ingredients()){
         if (self.ingredients()[ingred].name() != ""){
            var temp = new ingredientForDB(self.ingredients()[ingred].name(), 
                                          self.ingredients()[ingred].qty(), 
                                          self.ingredients()[ingred].unit().name);
            ingredientsForDB.push(temp);   
         }
       }
        return ingredientsForDB;       
    });
    
    
}

ko.applyBindings(new IngredientsViewModel());

var userId = "LSJipcKH0URTIuDUkGNZNoe34Lb2";  //TODO REPLACE WITH USERS ID FROM FIREBASE



function addButtonClicked(){
    console.log("add button clicked");
    writeUserData(userId, ingredients(), $("#recipe_name").val(), 
                  $("#recipe_type").val(), $("#directions").val());
    console.log("add button clicked");
}


function writeUserData(userId, ingredients, recipe_name, recipe_type, directions) {
  console.log(ingredients);
  // Get a key for a new recipe.
  var newRecipeKey = firebase.database().ref().child('users/' + userId + '/recipes').push().key;
  console.log(newRecipeKey);
  var recipe = {
    name: recipe_name, 
    type: recipe_type,
    directions: directions, 
    image: "image url here",
    ingredients: ingredients
   };
  
  var updates = {};
  updates['users/' + userId + '/recipes/' + newRecipeKey] = recipe;
  firebase.database().ref().update(updates);
  
  
  console.log('wrote to database');
}

$("#addRecipeButton").click(addButtonClicked);

    
});
  