Template.buttons.helpers({

  // get the text for the action button
  actionButtonText: function() {
    switch(this.game().phase) {
      case 'play':
        return 'Pass';
        break;

      case 'mark':
        if (this.isTurn() && this.game().readyToApprove) {
          return 'Approve';
        } else {
          return 'Submit';
        }
        break;

      default:
        return 'bork';
    }
  }
});

Template.buttons.events({
  // if the action button was clicked
  'click #actionButton': function (e) {
    // if it is the player's turn
    if (this.isTurn()) {
      switch(this.game().phase) {

        // if play phase, simulate pass
        case 'play':
          Meteor.call('pass', this._id, function(error, result) {

            // let the player know if anything went wrong
            if (error) {
              Flash.error(error.error);
            }
          });
          break;

        // if mark phase
        case 'mark':

          // if not ready to approve yet, propose the selection
          if (!this.game().readyToApprove) {
            Meteor.call('propose', this._id, function(error, result) {

              // let the player know if anything went wrong
              if (error) {
                Flash.error(error.error);
              }
            });

          // if ready, approve selection
          } else {
            Meteor.call('approve', this._id, function(error, result) {

              // let the player know if anything went wrong
              if (error) {
                Flash.error(error.error);
              }
            });
          }
          break;
      }
    }
  }
});
