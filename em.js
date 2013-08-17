if (Meteor.isClient) {
  Template.hello.events({
    'click button': function(event){
      event.preventDefault();
      console.log('hello');
      Meteor.call('asyncJob', 'fromClient', function(err, res){
        console.log(err);
        console.log(res);
      });
    }
  });
}

if (Meteor.isServer) {
  //var Fiber = require('fibers');
  var Future = Npm.require('fibers/future');
  Meteor.methods({
    asyncJob: function(message) {

      // Set up a future
      var fut = new Future();

      // This should work for any async method
      setTimeout(function() {

        // Return the results
        fut.return(message + " (delayed for 3 seconds)");

      }, 3 * 1000);

      // Wait for async to finish before returning
      // the result
      return fut.wait();
    }
  });
}
