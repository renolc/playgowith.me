Template.play.onCreated(function() {
  this.cellDrawSize = 50;
  this.hoverAlpha = 0.25;
  this.player     = this.data;
  this.gameCursor = this.data.gameCursor();
  this.game       = this.data.game();

  var _this = this;
  this.gameCursor.observeChanges({
    changed: function (id, fields) {
      _this.game = _this.data.game();
      draw.call(_this);
    }
  });
});

Template.play.onRendered(function() {
  gameCanvas.width  = this.game.board.length * this.cellDrawSize;
  gameCanvas.height = this.game.board.length * this.cellDrawSize;

  this.drawingContext = gameCanvas.getContext('2d');

  loadImagesAndDraw.call(this);
});

Template.play.events({
  'mousemove #gameCanvas': function (e) {
    var t = Template.instance();
    var cellSize = getCellSize.call(t);

    t.mousePosition = {
      col: Math.min(Math.max(Math.floor((e.pageX - gameCanvas.offsetLeft) / cellSize), 0), t.game.board.length),
      row: Math.min(Math.max(Math.floor((e.pageY - gameCanvas.offsetTop)  / cellSize), 0), t.game.board.length)
    };

    draw.call(t);
  },

  'mouseout #gameCanvas': function (e) {
    var t = Template.instance();

    t.mousePosition = null;

    draw.call(t);
  },

  'click #gameCanvas': function (e) {
    var t = Template.instance();

    Meteor.call('play', t.player._id, t.mousePosition);
  },

  'click #passButton': function (e) {
    var t = Template.instance();

    Meteor.call('pass', t.player._id);
  }
});

function getCellSize() {
  return gameCanvas.offsetWidth / this.game.board.length;
}

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
    WHITE:        new Image()
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
}

function draw() {

  // draw the board itself
  for (col = 0; col < this.game.board.length; col++) {
    for (row = 0; row < this.game.board.length; row++) {
      drawCell.call(this, col, row);
    }
  }

  // draw the hover piece
  drawHover.call(this);
}


function drawHover() {
  if (this.mousePosition && this.player._id === this.game.turn){
    if (this.game.board[this.mousePosition.col][this.mousePosition.row] === null) {
      this.drawingContext.save();
      this.drawingContext.globalAlpha = this.hoverAlpha;
      drawImage.call(this, getGamePieceImage.call(this, this.player.isWhite), this.mousePosition.col, this.mousePosition.row);
      this.drawingContext.restore();
    }
  }
}

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

function drawImage(img, col, row) {
  this.drawingContext.drawImage(img, col * this.cellDrawSize, row * this.cellDrawSize, this.cellDrawSize, this.cellDrawSize);
}

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
