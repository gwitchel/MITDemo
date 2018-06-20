if (Meteor.isServer) {
    Meteor.startup(function () {
      Meteor.methods({
        getData: async function (name) {
        let fetchResult;            
          if(name==undefined || name.length<=0) {
            throw new Meteor.Error(404, "Please enter a condition"); // user didn't enter a condition
          }
         // cleans the input to be more cooherent with retreiving data, still not always accurate
          fetchResult = await fetch(name); // retreives object from gene reference 
          if(typeof fetchResult == 'object'){
            const j = await fetchResult.html();
            return j; // if it's an object, return it
          }
        }
      });
    });
}