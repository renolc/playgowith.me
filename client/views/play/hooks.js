Template.play.onCreated(function() {
  this.cellDrawSize = 100;
  this.hoverAlpha   = 0.5;
  this.player       = this.data;
  this.gameCursor   = this.data.gameCursor();
  this.game         = this.data.game();
  this.readyToDraw  = false;
  this.showCaptured = true;
  this.showCapturedTimeout = null;


  /*********
   * Setup *
   *********/

  // clear any residual flashes from other tabs/former games
  Flash.clear();


  /********************
   * Helper Functions *
   ********************/

  // load all images and draw the board
  this.loadImagesAndDraw = function() {
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
          _this.readyToDraw = true;
          _this.draw();
        };
      };
    }

    // set the sources at the same time to kick off image loading
    this.Images.TOP.src          = '/images/play/topEdge.png';
    this.Images.RIGHT.src        = '/images/play/rightEdge.png';
    this.Images.BOTTOM.src       = '/images/play/bottomEdge.png';
    this.Images.LEFT.src         = '/images/play/leftEdge.png';
    this.Images.TOPRIGHT.src     = '/images/play/topRight.png';
    this.Images.TOPLEFT.src      = '/images/play/topLeft.png';
    this.Images.BOTTOMRIGHT.src  = '/images/play/bottomRight.png';
    this.Images.BOTTOMLEFT.src   = '/images/play/bottomLeft.png';
    this.Images.INTERSECTION.src = '/images/play/intersection.png';
    this.Images.BLACK.src        = '/images/play/black.png';
    this.Images.WHITE.src        = '/images/play/white.png';
    this.Images.LAST.src         = '/images/play/last.png';
    this.Images.X.src            = '/images/play/x.png';
  };

  // draw the board in its current state
  this.draw = function() {
    if (!this.readyToDraw || typeof gameCanvas === 'undefined') return;

    // draw the board itself
    for (col = 0; col < this.game.board.length; col++) {
      for (row = 0; row < this.game.board.length; row++) {
        this.drawCell(col, row);
      }
    }

    Cluster.getByGame(this.game._id).forEach(function(cluster) {
      this.drawCluster(cluster);
    }, this);

    // draw the last move marker
    this.drawLastPlayed();

    // draw the last captured pieces
    this.drawLastCaptured();

    // draw the hover piece
    this.drawHover();
  };

  // draw a single cell of the board
  this.drawCell = function(col, row) {
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
    this.drawImage(img, col, row);
  };

  // draw a cluster of cells
  this.drawCluster = function(cluster) {
    var img = this.getGamePieceImage(this.game.whiteId === cluster.playerId);
    cluster.cells.forEach(function(cell) {
      this.drawImage(img, cell[0], cell[1]);
      if (cluster.marked) {
        this.drawImage(this.Images.X, cell[0], cell[1]);
      }
    }, this);
  };

  // draw a transparent piece where the mouse is currently hovering over the board
  this.drawHover = function() {
    if (this.mousePosition && this.player.isTurn()){
      switch(this.game.phase) {

        // play phase
        case 'play':

          // if hovering over an empty space, show transparent play marker and pointer cursor
          if (this.game.board[this.mousePosition.col][this.mousePosition.row] === null) {
            $(gameCanvas).css('cursor', 'pointer');
            this.drawingContext.save();
            this.drawingContext.globalAlpha = this.hoverAlpha;
            this.drawImage(this.getGamePieceImage(this.player.isWhite), this.mousePosition.col, this.mousePosition.row);
            this.drawingContext.restore();

          // if hover space taken, don't draw anything and show default cursor
          } else {
            $(gameCanvas).css('cursor', 'auto');
          }
          break;

        // mark phase
        case 'mark':

          // if hovering over a cluster, show transparent x marker and pointer cursor
          if (this.game.board[this.mousePosition.col][this.mousePosition.row] !== null) {
            var cluster = Cluster.getByCell(this.game._id, this.mousePosition);

            $(gameCanvas).css('cursor', 'pointer');
            this.drawingContext.save();
            this.drawingContext.globalAlpha = this.hoverAlpha;
            cluster.cells.forEach(function(cell) {
              this.drawImage(this.Images.X, cell[0], cell[1]);
            }, this);
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
  };

  // draw a marker indicating where the last move was made
  this.drawLastPlayed = function() {
    if (this.game.last && Array.isArray(this.game.last)) {
      this.drawImage(this.Images.LAST, this.game.last[0], this.game.last[1]);
    }
  };

  // temporarily draw the last captured clusters
  this.drawLastCaptured = function() {
    if (this.showCaptured) {
      if (this.showCapturedTimeout === null) {
        this.showCapturedTimeout = setTimeout(this.stopDrawingLastCaptured.bind(this), 2000);
      }
      this.game.lastCapturedClusters.forEach(function(id) {
        var cluster = Cluster.findOne(id);
        this.drawCluster(cluster);
      }, this);
    }
  };

  // stop drawing last captured
  this.stopDrawingLastCaptured = function() {
    clearTimeout(this.showCapturedTimeout);
    this.showCapturedTimeout = null;
    this.showCaptured = false;
    this.draw();
  };

  // utility draw image function to simplify the rest of the draw code
  this.drawImage = function(img, col, row) {
    this.drawingContext.drawImage(img, col * this.cellDrawSize, row * this.cellDrawSize, this.cellDrawSize, this.cellDrawSize);
  };

  // get the image to draw for a cell depending on the cell's current value
  this.getGamePieceImage = function(from) {
    var img;
    switch(from) {
      case false:
        img = this.Images.BLACK;
        break;
      case true:
        img = this.Images.WHITE;
    }
    return img;
  };


  /*********************
   * Watcher Functions *
   *********************/

  // watch the game for changes so we can make sure we have the most recent copy
  var _this = this;
  this.gameCursor.observeChanges({
    changed: function (id, fields) {

      // get the latest copy of the game and draw it
      _this.game = _this.data.game();
      _this.showCaptured = true;
      _this.draw();
    }
  });
  Cluster.getByGame(this.game._id).observeChanges({
    added: function (id, fields) {
      _this.showCaptured = true;
      _this.draw();
    },
    removed: function(id) {
      _this.showCaptured = true;
      _this.draw();
    },
    changed: function (id, fields) {
      _this.showCaptured = true;
      _this.draw();
    }
  });
});

Template.play.onRendered(function() {
  gameCanvas.width  = this.game.board.length * this.cellDrawSize;
  gameCanvas.height = this.game.board.length * this.cellDrawSize;

  this.drawingContext = gameCanvas.getContext('2d');

  // load image files and start initial draw
  this.loadImagesAndDraw();
});