Template.application.helpers({
  template: function() {
    return Router.current().route.getName();
  }
});
