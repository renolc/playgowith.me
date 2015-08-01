Template.home.events({

  // if the play button is clicked, create a new game then navigate to the black player url
  'click button': function () {
    var size = $('.ui.dropdown')[0].value;

    Meteor.call('createGame', size, function (error, result) {
      Router.go('play', { _id: result });
    });
  }
});
