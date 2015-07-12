Router.configure({
  layoutTemplate: 'application'
});

Router.route('/', {
  name: 'home'
});

Router.route('/play/:_id', {
  name: 'play',

  subscriptions: function() {
    this.subscribe('player',  this.params._id).wait();
    this.subscribe('cluster', this.params._id).wait();
  },

  waitOn: function() {
    return Meteor.subscribe('game', this.params._id);
  },

  data: function() {
    return Player.findOne(this.params._id);
  }
});
