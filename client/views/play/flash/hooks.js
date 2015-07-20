Template.flash.onCreated(function() {
  this.gameCursor = this.data.gameCursor();
  this.game       = this.data.game();
  this.player     = this.data;

  var _this = this;
  this.gameCursor.observeChanges({
    added: updateFlash.bind(_this),
    changed: function() {
      _this.game = _this.data.game();
      updateFlash.call(_this);
    }
  });
});

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

function updateFlash(id, fields) {
  switch (this.game.phase) {

    // play phase
    case 'play':

      if (!this.player.isWhite && !this.game.bothPlayed) {
        Flash.info('Give this URL to your friend: <input class="shareUrl" value="' +
                   Router.routes.play.url({ _id: this.player.opponentId() }) +
                   '" readonly>');

      // let the player know when it's their turn and if their opponent passed
      } else if (this.player.isTurn()) {
        if (this.game.last === 'pass') {
          Flash.info("Your opponent passed. It's your turn!");
        } else {
          Flash.info("It's your turn!");
        }
      } else if (this.game.bothPlayed || this.player.isWhite) {
        Flash.warning('Waiting for opponent to play.');
      }

      break;

    // mark phase
    case 'mark':

      if (this.game.readyToApprove) {
        if (this.player.isTurn()) {
          Flash.info('Approve the selection, or edit it and submit your own.');
        } else {
          Flash.warning('Waiting for your opponent to approve or edit your selection.');
        }

      } else {
        if (this.player.isTurn()) {
          Flash.info('Select dead clusters and send them to your opponent for review.');
        } else {
          Flash.warning('Waiting for your opponent to finish selecting dead clusters.');
        }
      }

      break;

    case 'fin':
      Flash.info('Game over!<br>Black: ' + this.game.blackScore + '<br>White: ' + this.game.whiteScore);
      break;
  }
}
