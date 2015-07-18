Template.application.helpers({

  // set a class on the containing div given the current route name (to create targeted scss rules)
  template: function() {
    return Router.current().route.getName();
  }
});
