Template.home.events({
  'click button': function () {
    Meteor.call('createGame', function (error, result) {
      Router.go('play', { _id: result });
    });
  }
});
