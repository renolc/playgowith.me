Template.buttons.events({

  // if the action button was clicked
  'click .main.button': function () {

    // if it is the player's turn
    if (this.isTurn()) {
      switch(this.game().phase) {

        // if play phase, simulate pass
        case 'play':
          if (confirm('Pass your turn?')) {
            Meteor.call('pass', this._id, function(error, result) {
              if (error) {
                Flash.error(error.error);
              }
            });
          }
          break;

        // if mark phase
        case 'mark':

          // if not ready to approve yet, propose the selection
          if (!this.game().readyToApprove) {
            if (confirm('Propose the current selection?')) {
              Meteor.call('propose', this._id, function(error, result) {
                if (error) {
                  Flash.error(error.error);
                }
              });
            }

          // if ready, approve selection
          } else {
            if (confirm('Approve the current selection?')) {
              Meteor.call('approve', this._id, function(error, result) {
                if (error) {
                  Flash.error(error.error);
                }
              });
            }
          }
          break;
      }
    }
  },

  // if resign menu item clicked
  'click .resign.item': function() {
    if (confirm('Resign the current game?')) {
      Meteor.call('resign', this._id, function(error, result) {
        if (error) {
          Flash.error(error.error);
        }
      });
    }
  }
});
