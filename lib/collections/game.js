Game = new Mongo.Collection('game');

Meteor.methods({

  // create a new go game
  createGame: function () {
    var gameId = Game.insert({});

    // create the black and white players
    var black  = Player.create(gameId, false);
    var white  = Player.create(gameId, true);

    // link the game and players
    Game.update(gameId, {
      $set: {
        board: buildBoard(9), // default to 9 while testing
        turn: black._id,
        blackId: black._id,
        whiteId: white._id,
        bothPlayed: false,
        previousBoard: null
      }
    });

    return black._id;
  },

  // simulate a play given a player and board position
  play: function (playerId, position) {
    var player = Player.findOne(playerId);

    // ensure valid playerId
    if (typeof player === 'undefined') {
      throw new Meteor.Error('Invalid player');
    }

    var game = player.game();

    // ensure it is the player's turn
    if (game.turn !== playerId) {
      throw new Meteor.Error("Invalid move: it's not your turn");
    }

    // ensure position is valid
    if (position.col < 0 || position.col >= game.board.length ||
        position.row < 0 || position.row >= game.board.length) {
      throw new Meteor.Error('Invalid move: position not on board');
    }
    if (game.board[position.col][position.row] !== null) {
      throw new Meteor.Error('Invlid move: cell already occupied');
    }

    // get a copy of the board before our move is made
    var boardCopy = JSON.parse(JSON.stringify(game.board));

    // update the cell where the play is being made
    game.board[position.col][position.row] = player.isWhite;

    // capture enemy clusters, if any have no remaining liberties
    var enemyClusters = Cluster.getByLiberty(game._id, player.opponentId(), position);
    var capturedClusters = [];
    enemyClusters.forEach(function (cluster) {
      if (cluster.liberties.length <= 1) {
        cluster.cells.forEach(function (cell) {
          game.board[cell[0]][cell[1]] = null;
        }, this);

        // gather captured clusters so that we may later perform some liberty manipulation from them
        capturedClusters.push(cluster);
      }
    }, this);

    // make sure the move won't kill your own clusters
    var ourLiberties = getLibertiesByPosition(game.board, position);
    var friendlyClusters = Cluster.getByLiberty(game._id, playerId, position)
    var friendlyClustersWithNoLibertiesCount = 0;
    friendlyClusters.forEach(function (cluster) {
      if (cluster.liberties.length + ourLiberties <= 1) {
        friendlyClustersWithNoLibertiesCount++;
      }
    }, this);

    // if this kills friendly clusters, invalid move
    if (friendlyClusters.count() > 0 && friendlyClustersWithNoLibertiesCount === friendlyClusters.count()) {
      throw new Meteor.Error('Invalid move: no liberties');
    }

    // if no friently clusters and this space has no liberties, invalid move
    if (friendlyClusters.count() === 0 && ourLiberties.length === 0) {
      throw new Meteor.Error('Invalid move: no liberties');
    }

    // make sure we don't violate the ko rule
    if (JSON.stringify(game.previousBoard) === JSON.stringify(game.board)) {
      throw new Meteor.Error('Invalid move: ko');
    }

    // at this point, the play has passed all checks, so the move is valid. persist the changes

    // remove captured clusters
    capturedClusters.forEach(function (cluster) {
      cluster.cells.forEach(function (cell) {

        // add captured cells as a liberty to surrounding friendly clusters
        Cluster.getNextToCell(game._id, playerId, cell).forEach(function (cluster) {
          cluster.addLiberty(cell);
        }, this);
      }, this);

      Cluster.remove(cluster._id);
    }, this);

    // remove this liberty from enemy clusters
    Cluster.removeLiberty(game._id, player.opponentId(), position);

    // merge with any friendly clusters
    var cluster = Cluster.create(game._id, playerId, position, ourLiberties);
    cluster.merge(friendlyClusters);

    // update the game after the move
    Game.update(game._id, {
      $set: {
        board: game.board,
        turn:  player.opponentId(),
        last:  [position.col, position.row],
        bothPlayed: game.bothPlayed || player.isWhite,
        previousBoard: boardCopy
      }
    });
  },

  // simulate a pass
  pass: function (playerId) {
    var player = Player.findOne(playerId);

    // ensure valid playerId
    if (typeof player === 'undefined') {
      throw new Meteor.Error('Invalid player')
    }

    var game = player.game();

    // ensure it is the player's turn
    if (game.turn !== playerId) {
      throw new Meteor.Error("Invalid move: it's not your turn");
    }

    // update the game with the simulated pass
    Game.update(game._id, {
      $set: {
        turn: player.opponentId(),
        bothPlayed: game.bothPlayed || player.isWhite,
        last: 'pass'
      }
    });
  }
});

// build the board 2d array with null values given a size
function buildBoard(size) {
  var board = [];

  for (var col = 0; col < size; col++) {
    board.push([]);
    for (var row = 0; row < size; row++) {
      board[col].push(null);
    }
  }

  return board;
}

// given a position on a board, get the liberties, if any
function getLibertiesByPosition(board, position) {
  var liberties = [];

  if (position.col > 0 && board[position.col - 1][position.row] === null) {
    liberties.push([position.col - 1, position.row]);
  }

  if (position.col < board.length - 1 && board[position.col + 1][position.row] === null) {
    liberties.push([position.col + 1, position.row]);
  }

  if (position.row > 0 && board[position.col][position.row - 1] === null) {
    liberties.push([position.col, position.row - 1]);
  }

  if (position.row < board.length - 1 && board[position.col][position.row + 1] === null) {
    liberties.push([position.col, position.row + 1]);
  }

  return liberties;
}
