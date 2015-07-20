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
