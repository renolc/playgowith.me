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
        var url = Router.routes.play.url({ _id: this.player.opponentId() });
        Flash.info(
          'Share with your opponent: ' +
          '<a href="mailto:?subject=Play%20Go%20with%20me!&body=' + url + '"><i class="mail icon link"></i></a><br>' +
          '<a href="' + url + '">' + url + '</a>'
        );

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
      if (this.game.resignedId === this.player._id) {
        Flash.info('Game over!<br>You resigned.');
      } else if (this.game.resignedId === this.player.opponentId()) {
        Flash.info('Game over!<br>Your opponent resigned.');
      } else {
        Flash.info('Game over!<br>Black: ' + this.game.blackScore + '<br>White: ' + this.game.whiteScore);
      }
      break;
  }
}
