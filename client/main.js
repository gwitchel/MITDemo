import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { TacoUsers } from '../imports/api/tacousers.js';
import { Blaze } from 'meteor/blaze'
import './main.html';


Session.set('currentTaco', getData())
var listener = new window.keypress.Listener();
var my_scope = this;
var my_combos = listener.register_many([
    {
        "keys"          : "right", // swiping right means this taco sounds good
        "is_exclusive"  : true,
        "on_keyup"      : function(event) {
            console.log('right')
            var currentTaco = getData()
            addLikedTaco(currentTaco);
            Session.set('currentTaco', currentTaco)
            
        },
        "this"          : my_scope
    },
    {
      "keys"          : "left", // swiping left means this taco sounds bad
      "is_exclusive"  : true,
      "on_keyup"      : function(event) {
          console.log('left')
          Session.set('currentTaco', getData())
      },
      "this"          : my_scope
  }
]); 
Template.myTacos.helpers({
  likedTacos(){
    return TacoUsers.find({id : Meteor.userId()}).fetch()[0].likedTacos 
  }
})
Template.myTacos.events({
  'click .tacoButton': function(event){
    Session.set('tacoRecipe',event.currentTarget.id)
    console.log(event.currentTarget.id)
}
})
Template.tacoRecipe.helpers({
  title(){
    return "TITLE"
    //http://taco-randomizer.herokuapp.com//random/'
  },
  base(){ 
    debugger;

    var x = Session.get('tacoRecipe')
    var s = x.split("+");
    var sCompare = ['base_layer','condiment','mixin','seasoning','shell']
    console.log(s)
    // var base = x.substring(0,x.indexOf('+'));
    // x = x.substring(x.indexOf('+') + 1);
    // var condiment = x.substring(0,x.indexOf('+'))
    // x = x.substring(x.indexOf('+') + 1);
    
    var tacosToCheck = TacoUsers.find({id : Meteor.userId()}).fetch()[0].likedTacos
    for(var i = 0; i < tacosToCheck.length; i++){
      if(s[0] == tacosToCheck[i][sCompare[0]].slug
      && s[1] == tacosToCheck[i][sCompare[1]].slug
      && s[2] == tacosToCheck[i][sCompare[2]].slug
      && s[3] == tacosToCheck[i][sCompare[3]].slug
      && s[4] == tacosToCheck[i][sCompare[4]].slug){
        event.preventDefault();
        //calls the server side get request, deal with CORS request
        Meteor.call('getData', tacosToCheck[i][sCompare[0]].url, function(err,response) {
            if(err) {  
                Session.set('isError', true);  // do you need to display the help form for a wrong submit                                
                Session.set('serverDataResponse', "Error:" + err.reason); 
                return;
            }
            if(typeof Session.get('selectedCondition') !== 'undefined'){
                // if there have already been conditions submitted add this condition to the list 
                Session.set('isError', false);                                                
                console.log("foo")                 
            } else {
               // no condition has been submitted, start a list  
               console.log("foo")                
            }
        });
      }
    }
  }
})
function turnStringIntoSeperate(){

}

Template.recipe.helpers({
  base() {
    var x = Session.get('currentTaco');
      return x.base_layer.name;
  },
  condiment() {
    var x = Session.get('currentTaco');
      return x.condiment.name;
  },
  garnish() {
    var x = Session.get('currentTaco');
      return x.mixin.name;
  },
  seasoning() {
    var x = Session.get('currentTaco');
      return x.seasoning.name;
  },
  shell() {
    var x = Session.get('currentTaco');
      return x.shell.name;
  }
})

function getData(){
  var x = ""
  var request = new XMLHttpRequest(); 
  request.open('GET','http://taco-randomizer.herokuapp.com//random/',false)
  // add a timeout so that if it soen't come back after a given amount of time it will fail. 
  request.onload = function(){
    x = JSON.parse(request.responseText);
  }
  request.send();
  return x; 
}
function getDataForRecipea(urlWithContent){
      // jQuery async request
      $.ajax(
      {
          url: urlWithContent,
          dataType: "html",
          success: function(data) {
                                      return $('.result').html(data);
                                  },
          error: function(e) 
          {
              alert('Error: ' + e);
          }
      });
}
function addLikedTaco(tacoToAdd){
  var tacos = TacoUsers.find({id : Meteor.userId()}).fetch(); 
  if(tacos.length == 0){
    TacoUsers.insert( { 
      id:  Meteor.userId(),
      likedTacos : [tacoToAdd]
    } )
  } else {
    var arrToAdd = tacos[0].likedTacos
    arrToAdd.push(tacoToAdd)
    TacoUsers.update(tacos[0]._id, { $set: { likedTacos: arrToAdd } });        
  }
}

Router.go('/main')
Router.route('/', {
  template: 'main'
});
Router.route('/recipe', {
  template: 'recipe'
});
Router.route('/myTacos', {
  template: 'myTacos'
});
Router.route('/main', {
  template: 'main'
});

