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
  var ingredients;
  var userId = "LSJipcKH0URTIuDUkGNZNoe34Lb2"; // this is my user ID need to figure out login/sesion
    
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
  
  // firebase.onAuth(function(authData){
  //   if (authData == null){
  //     var provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithRedirect(provider); // redirect to sign in
  //   }
  //   else{
  //     console.log('logged in');
  //   }
  // });
  
  // firebase.auth().onAuthStateChanged(function(user){
  //   console.log(user);
  // });
    
  
  
  // var userId = firebase.auth().currentUser
  // // Start the provider for signing in
  // if (firebase.auth().currentUser == null){
  //   var provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithRedirect(provider); // redirect to sign in
  // }

  //console.log(userId);
  
  
  // Functions Start HERE____________________________________________
  function ingredientForDB(name, qty, unit){
    var self = this;
    self.name = name;
    self.qty = qty;
    self.unit = unit;
    
  }

  var addRow = function (){
    var row = document.createElement('div');
    row.className = 'row';
    document.getElementById('container').appendChild(row);
    return row;
    
  }

  var addRecipeCard = function(recipe_obj, rowEl){
    console.log(recipe_obj);
    var recipe_obj_image = ''; // set to default if no image in recipe_obj
    var col = document.createElement('div');
    col.className = "col s4";
    var card = document.createElement('div');
    card.className = 'card';
    var cardImage = document.createElement('div');
    cardImage.className = 'card-image recipe-image';
    var img = document.createElement('img');
    img.src = "http://lorempixel.com/125/125/food/1";
    var stacked = document.createElement('div');
    stacked.className = 'card-stacked';
    var cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    var span = document.createElement('span');
    span.className = 'card-title';
    span.innerHTML = recipe_obj.name;
    var p1 = document.createElement('p');
    p1.innerHTML = 'Prep Time: ' + recipe_obj.preptime;
    var p2 = document.createElement('p');
    p2.innerHTML = 'Cook Time: ' + recipe_obj.cooktime;
    var action = document.createElement('div');
    action.className = 'card-action';
    var view = document.createElement('a');
    view.className = 'view';
    view.innerHTML = 'View';
    var add = document.createElement('a');
    add.className = 'add-button';
    var icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = 'add';
    
    col.appendChild(card);
    card.appendChild(cardImage);
    cardImage.appendChild(img);
    card.appendChild(stacked);
    stacked.appendChild(cardContent);
    cardContent.appendChild(span);
    cardContent.appendChild(p1);
    cardContent.appendChild(p2);
    stacked.appendChild(action);
    action.appendChild(view);
    action.appendChild(add);
    add.appendChild(icon);
    // add click event to add and view
    
    rowEl.appendChild(col); // add row and card to the row
  }
  
  function writeUserData(userId, ingredients, recipe_name, recipe_type, directions, prep_time, cook_time) {
    console.log(ingredients);
    // Get a key for a new recipe.
    var newRecipeKey = firebase.database().ref().child('users/' + userId + '/recipes').push().key;
    console.log(newRecipeKey);
    var recipe = {
      name: recipe_name, 
      type: recipe_type,
      directions: directions, 
      image: "image url here",
      ingredients: ingredients,
      preptime: prep_time,
      cooktime: cook_time,
      id: newRecipeKey
     };
    
    var updates = {};
    updates['users/' + userId + '/recipes/' + newRecipeKey] = recipe;
    firebase.database().ref().update(updates);
    // add error handling
  }
  
  function addButtonClicked(){
    console.log("add button clicked");
    writeUserData(userId, ingredients(), $("#recipe_name").val(), 
                  $("#recipe_type").val(), $("#directions").val(),
                  $("#prep_time").val(), $("#cook_time").val());
    console.log("add button clicked");
  }
  
  function clearRecipeButtonClicked(){
    console.log("clear button clicked");
    // go through all of the modal to add recipe and clear all entries
    $("#directions").val('');
    $("#cook_time").val('');
    $("#prep_time").val('');
    $("#recipe_type option[value='5']").prop('selected', true);
    $('#recipe_name').val('');
    $("#directions").trigger('autoresize');
    $("#cook_time").trigger('autoresize');
    $("#prep_time").trigger('autoresize');
    $('#recipe_name').trigger('autoresize');
    
  }

  // Functions END HERE ____________________________________________
  
  // add event handlers ____________________________________________
  $("#addRecipeButton").click(addButtonClicked);
  $("#clearRecipeButton").click(clearRecipeButtonClicked);
  // end add event handlers_________________________________________
  
  
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
  // adding all of the dinners to the html TODO add other mealtypes
  var row = addRow();
  for (var i = 0; i < dinners.length; i++){
    if (i % 3 == 0){
      row = addRow();
    }
    addRecipeCard(dinners[i], row);
    }
  });
    
  // Class to represent a row in the ingredients
  function Ingredient(name, qty, unit) {
      var self = this;
      self.name = ko.observable(name);
      self.qty = ko.observable(qty);
      self.unit = ko.observable(unit);
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


});
  