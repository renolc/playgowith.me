Flash = new Mongo.Collection(null);

Flash.flashes

Flash.create = function(type, icon, header, message) {
  Flash.insert({
    type:    type,
    icon:    icon,
    header:  header,
    message: message
  });
};

Flash.info = function(header, message) {
  Flash.create('info', 'info', header, message);
};

Flash.error = function(header, message) {
  Flash.create('error', 'warning', header, message);
};
