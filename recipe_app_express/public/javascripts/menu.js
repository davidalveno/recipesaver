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
  var mealType;
  var day;
  var recipes;
  var currentMealType;
  var autocomplete = {};
  var dmenu = null; // change this to use the selected menu from the cookie??
  var mealTypeEnum = {
    breakfast: '1',
    lunch: '2',
    dinner: '3',
    snack1: '4',
    snack2: '5',
    dessert: '6'
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
  
  // Functions start HERE __________________________________________
  // Function to create an option for the modal, this is what a user will 
  // Select from when they go to the menu.
  // This function will also add them to the element
  function addOptionsToSelect(){  // this should probably all be refactored!!
    var options_obj;
    tdNode = this
    var trNode = tdNode.parentElement;
    var tableCols = trNode.children;
    // get the day that was clicked
    for (var i=0; i<tableCols.length; i++){
      if (tableCols[i] === tdNode){
        day = i-1;
        break;
      }
    }

    // Figure out which was clicked
    var classList = this.className.split(/\s+/);
    for (var i = 0; i < classList.length; i++) {
    switch (classList[i]){
        case "breakfast":
          options_obj = breakfasts;
          mealType = "Breakfast";
          currentMealType = mealTypeEnum.breakfast;
          break;
        case "lunch":
          options_obj = lunches;
          mealType = "Lunch";
          currentMealType = mealTypeEnum.lunch;
          break;
        case "dinner":
          options_obj = dinners;
          mealType = "Dinner";
          currentMealType = mealTypeEnum.dinner;
          break;
        case "snack1":
          options_obj = snacks;
          mealType = "Snack";
          currentMealType = mealTypeEnum.snack1;
          break;
        case "snack2":
          options_obj = snacks;
          mealType = "Snack";
          currentMealType = mealTypeEnum.snack2;
          break;
        case "dessert":
          options_obj = desserts;
          mealType = "Dessert";
          currentMealType = mealTypeEnum.dessert;
          break;
      }
  }
    var newOption;
    var optionsHtml = '';
    // create meal options to select in dropdown
    for (key in options_obj){
      newOption = "<option value='" + options_obj[key].id + "'>" + options_obj[key].name + "</option>";
      optionsHtml += newOption;
    }
    $("#mealSelection").empty();
    $("#mealSelection").append(optionsHtml);
    $("#mealType").html(mealType);
    
}
  // Functions end HERE __________________________________________
  
  var recipesRef = firebase.database().ref('/users/' + userId + '/recipes');
  // Getting all recipes and putting them in the right list
  recipesRef.once('value').then(function(snapshot) {
  recipes = snapshot.val();
  var index = 0;
  var recipe_length = Object.keys(recipes).length;
  var keys = '';
  for (key in recipes){
    keys = recipes[key].name;
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
      case mealTypeEnum.snack1:
        snacks.push(recipes[key]);
        break;
      case mealTypeEnum.snack2:
        snacks.push(recipes[key]);
        break;
      case mealTypeEnum.dessert:
        desserts.push(recipes[key]);
        break;
    }

    autocomplete[keys] = null;
  }
  autocomplete = {"apple pie" : null, "cranberry" : null};
  });
  
  // for the search feature (need to change this probably to something better)
  $('input.autocomplete').autocomplete({
    data: {"apple pie" : null, "cranberry" : null},
    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
  });
  //add onclick even to add buttons
  $("#save_btn").click(addOptionsToSelect);
  $(".breakfast").click(addOptionsToSelect);
  $(".lunch").click(addOptionsToSelect);
  $(".dinner").click(addOptionsToSelect);
  $(".snack1").click(addOptionsToSelect);
  $(".snack2").click(addOptionsToSelect);
  $(".dessert").click(addOptionsToSelect);
  $("#recipeDoneButton").click(recipeAddClick);

  // Class to represent a row in the seat reservations grid
  function mealtemp(recipe) {
      var self = this;
      conole.log('test2');
      self.recipe = ko.observable(recipe);
  }
  
  

  // Overall viewmodel for this screen, along with initial state
  function MenuViewModel() {
      var self = this;
      self.availableMeals = dinners;
  }
  
  function menu(){
    var self = this;
    self.id = '';
    self.breakfasts = [{},{},{},{},{},{},{}]; // [sun, mon, tue, wed, thur, fri, sat]
    self.lunches = [{},{},{},{},{},{},{}];
    self.dinners = [{},{},{},{},{},{},{}];
    self.snacks1 = [{},{},{},{},{},{},{}];
    self.snacks2 = [{},{},{},{},{},{},{}];
    self.desserts = [{},{},{},{},{},{},{}];  // meal_obj = meal, meal_type=mealTypeEnum,index (0=sun)
    self.addMeal = function(meal, meal_type, day){
      switch(meal_type){
        case mealTypeEnum.breakfast:
          self.breakfasts[day] = meal;
        case mealTypeEnum.lunch:
          self.lunches[day] = meal;
        case mealTypeEnum.dinner:
          self.dinners[day] = meal;
        case mealTypeEnum.snack1:
          self.snacks1[day] = meal; //TODO fix the snacks...enum is only one snack
        case mealTypeEnum.snack2:
          self.snacks2[day] = meal;
        case mealTypeEnum.dessert:
          self.desserts[day] = meal;
      }
    }
  }
  
  var currentMenu = new menu();
  
  // This will create an object that will store the 
  // recipe and the servings that are selected
  function meal(recipe_name, servings){
    var self = this;
    self.recipe_name = recipe_name;
    self.servings = servings;
  }
  
  // Function to take an element and change it's image to a photo instead of the +
  function changeToPhoto(photo_file, element){
    element.innerHTML = '<img class="editable circle responsive-img" src="images/' + photo_file +'"' + 'width="50" height="50"' + '>';
  }
  
  
  // when a recipe is accepted ie the done button
  function recipeAddClick(){
    // Get the image from the database url or use a default based on type of meal
    var photo_file = "food.jpg"
    changeToPhoto(photo_file, tdNode);
    // Get the right meal obj
    var mealId = $('#mealSelection').find(":selected").val();
    for (key in recipes){
      if(mealId == recipes[key].id){
        //update menu
        currentMenu.addMeal(recipes[key], currentMealType, day);
        break;
      }
    }
  }
  
  ko.applyBindings(new MenuViewModel());
});
      