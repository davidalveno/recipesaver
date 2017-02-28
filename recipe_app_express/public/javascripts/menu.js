$(document).ready(function() {
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  
  // Initialize all variables that will be used
  var dinners = [];
  var lunches = [];
  var snacks = [];
  var breakfasts = [];
  var desserts = [];
  var tdNode;
  
  var mealTypeEnum = {
    breakfast: '1',
    lunch: '2',
    dinner: '3',
    snack: '4',
    dessert: '5'
  }
  
  var mealSelectElem = $("#mealSelection");
  
 
  
  
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
  });

  // Class to represent a row in the seat reservations grid
  function mealtemp(recipe) {
      var self = this;
      conole.log('test2');
      self.recipe = ko.observable(recipe);
  }
  
  // Function to create an option for the modal, this is what a user will 
  // Select from when they go to the menu.
  // This function will also add them to the element
  function addOptionsToSelect(){
    var options_obj;
    var mealType;
    tdNode = this
    console.log(this);
    // Figure out which was clicked
    var classList = this.className.split(/\s+/);
    for (var i = 0; i < classList.length; i++) {
    switch (classList[i]){
        case "breakfast":
          options_obj = breakfasts;
          mealType = "Breakfast";
          break;
        case "lunch":
          options_obj = lunches;
          mealType = "Lunch";
          break;
        case "dinner":
          options_obj = dinners;
          mealType = "Dinner";
          break;
        case "snack":
          options_obj = snacks;
          mealType = "Snack";
          break;
        case "dessert":
          options_obj = desserts;
          mealType = "Dessert";
          break;
      }
  }
    //create array of strings for the options
    var options = [];
    for (key in options_obj){
      options.push(options_obj[key].name);
    }

    var newOption;
    var optionsHtml = '';
    
    for (var i = 0; i < options.length; i++){
      newOption = "<option>" + options[i] + "</option>";
      optionsHtml += newOption;
    }
    $("#mealSelection").empty();
    $("#mealSelection").append(optionsHtml);
    $("#mealType").html(mealType);
    
}

  // Overall viewmodel for this screen, along with initial state
  function MenuViewModel() {
      var self = this;

      // Non-editable catalog data - would come from the server
      self.availableMeals = dinners;

      // Editable data
      //self.seats = ko.observableArray([
      //  new SeatReservation("Steve", self.availableMeals[0]),
      //new SeatReservation("Bert", self.availableMeals[0])
      //]);
  }
  
  function menu(){
    var self = this;
    self.breakfasts = []; // [sun, mon, tue, wed, thur, fri, sat]
    self.lunches = [];
    self.dinners = [];
    self.snacks1 = [];
    self.snacks2 = [];
    self.desserts = [];  // meal_obj, 
    self.addMeal = function(meal, meal_type, day){
      
      
    }
  }
  
  // This will create an object that will store the 
  // recipe and the servings that are selected
  function meal(recipe_name, servings){
    var self = this;
    self.recipe_name = recipe_name;
    self.servings = servings;
  }
  
  // Function to take an element and change it's image to a photo instead of the +
  function changeToPhoto(photo_file, element){
    element.innerHTML = '<img class="editable" src="images/' + photo_file +'">';
  }
  
  
  // when a recipe is accepted ie the done button
  function recipeAddClick(){
    // Get the image from the database url or use a default based on type of meal
    var photo_file = "food.jpg"
    changeToPhoto(photo_file, tdNode);
  }
  
   //add onclick even to add buttons
  $(".breakfast").click(addOptionsToSelect);
  $(".lunch").click(addOptionsToSelect);
  $(".dinner").click(addOptionsToSelect);
  $(".snack").click(addOptionsToSelect);
  $(".dessert").click(addOptionsToSelect);
  $("#recipeDoneButton").click(recipeAddClick);

  ko.applyBindings(new MenuViewModel());
});
      