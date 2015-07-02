Template.application.helpers({
  template: function() {
    var route = Router.current().route.getName();
    return route ? route : 'application';
  }
});
