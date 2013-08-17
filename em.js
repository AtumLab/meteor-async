if (Meteor.isClient) {
  Template.hello.events({
    'click button.future': function(event){
      event.preventDefault();
      console.log('before future');
      Meteor.call('asyncFuture', 'fromClient', function(err, res){
        console.log(err);
        console.log(res);
      });
    },
    'click button.fiber': function(event){
      event.preventDefault();
      console.log('before fiber');
      Meteor.call('asyncFiber', 'fromClient', function(err, res){
        console.log(err);
        console.log(res);
      });
    }
  });
}

if (Meteor.isServer) {
  var Fiber = Npm.require('fibers');
  var Future = Npm.require('fibers/future');
  Meteor.methods({
    asyncFuture: function(message) {

      // Set up a future
      var fut = new Future();

      // This should work for any async method
      Meteor.setTimeout(function() {

        // Return the results
        fut.return(message + " (delayed for 3 seconds)");

      }, 3 * 1000);

      // Wait for async to finish before returning
      // the result
      return fut.wait();
    },
    asyncFiber: function (message) {
      var fiber = Fiber.current;

      Meteor.setTimeout(function () {
        
        fiber.run(message + " (delayed for 3 seconds)");
      
      }, 3 * 1000);      
 
      return Fiber.yield();
    }
  });
}
