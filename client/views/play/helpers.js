Template.play.onCreated(function() {
  this.cellDrawSize = 50;
  this.hoverAlpha   = 0.5;
  this.player       = this.data;
  this.gameCursor   = this.data.gameCursor();
  this.game         = this.data.game();

  // clear any residual flashes from other tabs/former games
  Flash.clear();

  // watch the game for changes so we can make sure we have the most recent copy
  var _this = this;
  this.gameCursor.observeChanges({
    changed: function (id, fields) {

      // get the latest copy of the game and draw it
      _this.game = _this.data.game();
      draw.call(_this);

      switch (_this.game.phase) {

        // play phase
        case 'play':

          // let the player know when it's their turn and if their opponent passed
          if (_this.player.isTurn()) {
            if (_this.game.last === 'pass') {
              Flash.info("Your opponent passed. It's your turn!");
            } else {
              Flash.info("It's your turn!");
            }
          } else if (_this.game.bothPlayed || _this.player.isWhite) {
            Flash.warning('Waiting for opponent to play.');
          }

          break;

        // mark phase
        case 'mark':

          // let the player know if it is their turn to mark or accept the dead
          if (_this.player.isTurn()) {
            Flash.info('Select dead clusters and send them to your opponent for review.');
          } else {
            Flash.warning('Waiting for your opponent to finish selecting dead clusters.');
          }

          break;
      }
    }
  });
});

Template.play.onRendered(function() {
  gameCanvas.width  = this.game.board.length * this.cellDrawSize;
  gameCanvas.height = this.game.board.length * this.cellDrawSize;

  this.drawingContext = gameCanvas.getContext('2d');

  // animate flash messages in and out
  this.find('#messages')._uihooks = {
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

  // load image files and start initial draw
  loadImagesAndDraw.call(this);

  switch (this.game.phase) {

    // play phase
    case 'play':

      // show share url if opponent hasn't played yet
      if (!this.player.isWhite && !this.game.bothPlayed) {
        Flash.info('Give this URL to your friend: <input class="shareUrl" value="' +
                   Router.routes.play.url({ _id: this.player.opponentId() }) +
                   '" readonly>');

      // if the player is refreshing the page or just now returning to this games
      // let them know if it's their turn and if their opponent passed
      } else if (this.player.isTurn()) {
        if (this.game.last === 'pass') {
          Flash.info("Your opponent passed. It's your turn!");
        } else if (this.game.bothPlayed || this.player.isWhite) {
          Flash.info("It's your turn!");
        }
      } else if (this.game.bothPlayed || this.player.isWhite) {
        Flash.warning('Waiting for opponent to play.');
      }

      break;

    // mark phase
    case 'mark':

      // let the player know if it is their turn to mark or accept the dead
      if (this.player.isTurn()) {
        Flash.info('Select dead clusters and send them to your opponent for review.');
      } else {
        Flash.warning('Waiting for your opponent to finish selecting dead clusters.');
      }

      break;
  }
});

Template.play.events({

  // get the cell the mouse is hovering over
  'mousemove #gameCanvas': function (e) {
    var t = Template.instance();
    var cellSize = getCellSize.call(t);

    t.mousePosition = {
      col: Math.min(Math.max(Math.floor((e.pageX - gameCanvas.offsetLeft) / cellSize), 0), t.game.board.length - 1),
      row: Math.min(Math.max(Math.floor((e.pageY - gameCanvas.offsetTop)  / cellSize), 0), t.game.board.length - 1)
    };

    draw.call(t);
  },

  // clear out our mose position if not hovering over the board (prevents residual hover piece from being shown)
  'mouseout #gameCanvas': function (e) {
    var t = Template.instance();

    t.mousePosition = null;

    draw.call(t);
  },

  // if the board was clicked
  'click #gameCanvas': function (e) {
    var t = Template.instance();

    // if it is play phase, the players turn, and the clicked location is empty, simulate a play move here
    if (t.game.phase === 'play' &&
        t.player.isTurn() &&
        t.game.board[t.mousePosition.col][t.mousePosition.row] === null) {
      Meteor.call('play', t.player._id, t.mousePosition, function(error, result) {

        // let the player know if anything went wrong
        if (error) {
          Flash.error(error.error);
        } else if (t.game.bothPlayed) {
          Flash.clear();
        }
      });
    }
  },

  // if the pass button was clicked
  'click #passButton': function (e) {
    var t = Template.instance();

    // if it is the play phase and the player's turn, simulate the pass
    if (t.game.phase === 'play' && t.player.isTurn()) {
      Meteor.call('pass', t.player._id, function(error, result) {

        // let the player know if anything went wrong
        if (error) {
          Flash.error(error.error);
        } else if (t.game.bothPlayed) {
          Flash.clear();
        }
      });
    }
  },

  // if the share url input is clicked, select the whole link for ease of copying
  'click .shareUrl': function (e) {
    var targetElement = $(e.target);
    targetElement.select();
  }
});

Template.play.helpers({

  // get all of the flash messages (local collection only)
  flashes: function() {
    return Flash.find();
  }
});

// get the size in pixels of each cell
function getCellSize() {
  return gameCanvas.offsetWidth / this.game.board.length;
}

// load all images and draw the board
function loadImagesAndDraw() {
  this.Images = {
    INTERSECTION: new Image(),
    TOPLEFT:      new Image(),
    TOPRIGHT:     new Image(),
    BOTTOMLEFT:   new Image(),
    BOTTOMRIGHT:  new Image(),
    TOP:          new Image(),
    RIGHT:        new Image(),
    LEFT:         new Image(),
    BOTTOM:       new Image(),
    BLACK:        new Image(),
    WHITE:        new Image(),
    LAST:         new Image(),
    X:            new Image()
  };

  // wait for all of the images to load before drawing the board
  var imagesLoadedCount = 0;
  var _this = this;
  for (k in this.Images) {
    v = this.Images[k];
    imagesLoadedCount++;
    v.onload = function() {
      imagesLoadedCount--;
      if (imagesLoadedCount === 0) {
        draw.call(_this);
      }
    };
  }

  // set the sources at the same time to kick off image loading
  this.Images.TOP.src           = '/images/play/topEdge.png';
  this.Images.RIGHT.src         = '/images/play/rightEdge.png';
  this.Images.BOTTOM.src        = '/images/play/bottomEdge.png';
  this.Images.LEFT.src          = '/images/play/leftEdge.png';
  this.Images.TOPRIGHT.src      = '/images/play/topRight.png';
  this.Images.TOPLEFT.src       = '/images/play/topLeft.png';
  this.Images.BOTTOMRIGHT.src   = '/images/play/bottomRight.png';
  this.Images.BOTTOMLEFT.src    = '/images/play/bottomLeft.png';
  this.Images.INTERSECTION.src  = '/images/play/intersection.png';
  this.Images.BLACK.src         = '/images/play/black.png';
  this.Images.WHITE.src         = '/images/play/white.png';
  this.Images.LAST.src          = '/images/play/last.png';
  this.Images.X.src             = '/images/play/x.png';
}

// draw the board in its current state
function draw() {

  // draw the board itself
  for (col = 0; col < this.game.board.length; col++) {
    for (row = 0; row < this.game.board.length; row++) {
      drawCell.call(this, col, row);
    }
  }

  // draw the last move marker
  drawLast.call(this);

  // draw the hover piece
  drawHover.call(this);
}

// draw a marker indicating where the last move was made
function drawLast() {
  if (this.game.last) {
    if (Array.isArray(this.game.last)) {
      drawImage.call(this, this.Images.LAST, this.game.last[0], this.game.last[1]);
    }
  }
}

// draw a transparent piece where the mouse is currently hovering over the board
function drawHover() {
  if (this.mousePosition && this.player.isTurn()){
    switch(this.game.phase) {

      // play phase
      case 'play':

        // if hovering over an empty space, show transparent play marker and pointer cursor
        if (this.game.board[this.mousePosition.col][this.mousePosition.row] === null) {
          $(gameCanvas).css('cursor', 'pointer');
          this.drawingContext.save();
          this.drawingContext.globalAlpha = this.hoverAlpha;
          drawImage.call(this, getGamePieceImage.call(this, this.player.isWhite), this.mousePosition.col, this.mousePosition.row);
          this.drawingContext.restore();

        // if hover space taken, don't draw anything and show default cursor
        } else {
          $(gameCanvas).css('cursor', 'auto');
        }
        break;

      // mark phase
      case 'mark':

        // if hovering over an occupied space, show transparent x marker and pointer cursor
        if (this.game.board[this.mousePosition.col][this.mousePosition.row] !== null) {
          $(gameCanvas).css('cursor', 'pointer');
          this.drawingContext.save();
          this.drawingContext.globalAlpha = this.hoverAlpha;
          drawImage.call(this, this.Images.X, this.mousePosition.col, this.mousePosition.row);
          this.drawingContext.restore();

        // if hover space empty, don't draw anything and show default cursor
        } else {
          $(gameCanvas).css('cursor', 'auto');
        }
        break;
    }

  // if it's not the player's turn, set default cusor
  } else {
    $(gameCanvas).css('cursor', 'auto');
  }
}

// draw a single cell of the board
function drawCell(col, row) {
  var img;

  if (row === 0 && col === 0)
    img = this.Images.TOPLEFT
  else if (row === 0 && col === this.game.board.length - 1)
    img = this.Images.TOPRIGHT
  else if (row === this.game.board.length - 1 && col === 0)
    img = this.Images.BOTTOMLEFT
  else if (row === this.game.board.length - 1 && col === this.game.board.length - 1)
    img = this.Images.BOTTOMRIGHT
  else if (row === 0)
    img = this.Images.TOP
  else if (row === this.game.board.length - 1)
    img = this.Images.BOTTOM
  else if (col === 0)
    img = this.Images.LEFT
  else if (col === this.game.board.length - 1)
    img = this.Images.RIGHT
  else
    img = this.Images.INTERSECTION

  // draw the board
  drawImage.call(this, img, col, row);

  // if there is a piece in this cell, draw it too
  img = getGamePieceImage.call(this, this.game.board[col][row]);
  if (img)
    drawImage.call(this, img, col, row);
}

// utility draw image function to simplify the rest of the draw code
function drawImage(img, col, row) {
  this.drawingContext.drawImage(img, col * this.cellDrawSize, row * this.cellDrawSize, this.cellDrawSize, this.cellDrawSize);
}

// get the image to draw for a cell depending on the cell's current value
function getGamePieceImage(from) {
  var img;
  switch(from) {
    case false:
      img = this.Images.BLACK;
      break;
    case true:
      img = this.Images.WHITE;
  }
  return img;
}
