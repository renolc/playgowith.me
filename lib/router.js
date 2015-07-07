Router.configure({
  layoutTemplate: 'application'
});

Router.route('/', {
  name: 'home'
});

Router.route('/play/:_id', {
  name: 'play',

  data: function() {
    return Player.findOne(this.params._id);
  }
});
