Template.play.events({

  // get the cell the mouse is hovering over
  'mousemove #gameCanvas': function (e) {
    var t = Template.instance();
    var cellSize = getCellSize.call(t);

    t.mousePosition = {
      col: Math.min(Math.max(Math.floor((e.pageX - gameCanvas.offsetLeft) / cellSize), 0), this.game().board.length - 1),
      row: Math.min(Math.max(Math.floor((e.pageY - gameCanvas.offsetTop)  / cellSize), 0), this.game().board.length - 1)
    };

    t.draw();
  },

  // clear out our mose position if not hovering over the board (prevents residual hover piece from being shown)
  'mouseout #gameCanvas': function (e) {
    var t = Template.instance();

    t.mousePosition = null;

    t.draw();
  },

  // if the board was clicked
  'click #gameCanvas': function (e) {
    var t = Template.instance();

    // if it is the player's turn
    if (this.isTurn()) {

      // if it is play phase and the clicked location is empty, simulate a play move here
      if (this.game().phase === 'play' &&
          this.game().board[t.mousePosition.col][t.mousePosition.row] === null) {
        Meteor.call('play', this._id, t.mousePosition, function(error, result) {

          // let the player know if anything went wrong
          if (error) {
            Flash.error(error.error);
          }
        });

      // if mark phase and position clicked contains a cluster, mark cluster as dead
      } else if (this.game().phase === 'mark' &&
                 this.game().board[t.mousePosition.col][t.mousePosition.row] !== null) {
        Meteor.call('mark', this._id, t.mousePosition, function(error, result) {

          // let player know if anything went wrong
          if (error) {
            Flash.error(error.error);
          }
        });
      }
    }
  }
});

// get the size in pixels of each cell
function getCellSize() {
  return gameCanvas.offsetWidth / this.game.board.length;
}
