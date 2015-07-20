Template.flash.events({

  // if the share url input is clicked, select the whole link for ease of copying
  'click .shareUrl': function (e) {
    var targetElement = $(e.target);
    targetElement.select();
  }
});
