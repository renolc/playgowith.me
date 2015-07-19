Template.flash.onRendered(function() {
  // animate flash messages in and out
  this.find('.messages')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .slideDown();
    },

    removeElement: function(node) {
      $(node).slideUp(function() {
        $(this).remove();
      });
    }
  };
});

Template.flash.helpers({

  // get all of the flash messages (local collection only)
  flashes: function() {
    return Flash.find();
  }
});
