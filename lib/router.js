Router.configure({
  layoutTemplate: 'application'
});

Router.route('/', function() {
  this.render('home');
});

Router.route('/play/:_id', function() {
  this.render('play', {
    data: function() {
      return Player.findOne(this.params._id);
    }
  });
})
