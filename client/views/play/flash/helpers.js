Template.flash.helpers({

  // get all of the flash messages (local collection only)
  flashes: function() {
    return Flash.find();
  }
});
