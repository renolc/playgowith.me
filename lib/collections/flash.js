Flash = new Mongo.Collection(null);

// the next flash to show
Flash.next = null;

// show a flash message
Flash.show = function(type, icon, message) {
  var flashes = Flash.find();

  // if currently none showing, just insert it
  if (flashes.count() === 0) {
    Flash.insert({
      type:    type,
      icon:    icon,
      message: message
    });

  // if a flash is already there, make sure it's not a dupe
  // if not, set the next flash and clear this one
  } else {
    var flash = flashes.fetch()[0];
    if (flash.type !== type || flash.icon !== icon || flash.message !== message) {
      Flash.next = {
        type:    type,
        icon:    icon,
        message: message
      };
      Flash.clear();
    }
  }
};

// quick helper to show an info flash
Flash.info = function(message) {
  Flash.show('info', 'info', message);
};

// quick helper to show an error flash
Flash.error = function(message) {
  Flash.show('error', 'warning', message);
};

// clear the current flash messsage
Flash.clear = function() {
  Flash.remove({});
}

// after the message is cleared, if one is queued up in next, show it after a delay
Flash.after.remove(function() {
  if (Flash.next) {
    setTimeout(function() {
      Flash.insert(Flash.next);
      Flash.next = null;
    }, 500);
  }
});
