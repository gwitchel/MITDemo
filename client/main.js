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
    debugger;
    return TacoUsers.find({id : Meteor.userId()}).fetch()[0].likedTacos 
  }
})

Template.tacoRecipe.helpers({
  recipe(){
    // stahp 
  }
})

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
Router.go('/')
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

