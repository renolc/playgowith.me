Template.buttons.helpers({

  // get the text for the main button
  mainButtonText: function() {
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
        return 'Fin';
    }
  }
});
