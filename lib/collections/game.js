Game = new Mongo.Collection('game');

Meteor.methods({
  createGame: function () {
    var gameId = Game.insert({});
    var black  = Player.create(gameId, false);
    var white  = Player.create(gameId, true);

    Game.update(gameId, {
      $set: {
        board: buildBoard(),
        turn: black._id,
        blackId: black._id,
        whiteId: white._id
      }
    });

    return black._id;
  },

  play: function (playerId, position) {
    var player = Player.findOne(playerId);

    // ensure valid playerId
    check(player, Match.Where(function (x) {
      return typeof x !== 'undefined';
    }));

    var game = player.game();

    // ensure it is the player's turn
    check(playerId, Match.Where(function (x) {
      return game.turn === x;
    }));

    // ensure position is valid
    check(position, Match.Where(function (x) {
      return (x.col >= 0 && x.col < game.board.length) &&
             (x.row >= 0 && x.row < game.board.length) &&
             (game.board[x.col][x.row] === null);
    }));

    game.board[position.col][position.row] = player.isWhite;

    // capture enemy clusters
    var enemyClusters = Cluster.getByLiberty(game._id, player.opponentId(), position);
    enemyClusters.forEach(function (cluster) {
      if (cluster.liberties.length <= 1) {
        cluster.cells.forEach(function (cell) {
          game.board[cell[0]][cell[1]] = null;

          // add this cell as a liberty to surrounding friendly clusters
          Cluster.getNextToCell(game._id, playerId, cell).forEach(function (cluster) {
            cluster.addLiberty(cell);
          }, this);
        }, this);
        Cluster.remove(cluster._id);
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
      throw new Meteor.Error('invalid move');
    }

    // if no friently clusters and this space has no liberties, invalid move
    if (friendlyClusters.count() === 0 && ourLiberties.length === 0) {
      throw new Meteor.Error('invalid move');
    }

    // remove this liberty from enemy clusters
    Cluster.removeLiberty(game._id, player.opponentId(), position);

    // merge with any friendly clusters
    var cluster = Cluster.create(playerId, position, ourLiberties);
    cluster.merge(friendlyClusters);

    Game.update(game._id, {
      $set: {
        board: game.board,
        turn: player.opponentId()
      }
    });
  },

  pass: function (playerId) {
    var player = Player.findOne(playerId);

    // ensure valid playerId
    check(player, Match.Where(function (x) {
      return typeof x !== 'undefined';
    }));

    var game = player.game();

    // ensure it is the player's turn
    check(playerId, Match.Where(function (x) {
      return game.turn === x;
    }));

    Game.update(game._id, {
      $set: {
        turn: player.opponentId()
      }
    });
  }
});

function buildBoard() {
  var board = [];
  var size = 19;

  for (var col = 0; col < size; col++) {
    board.push([]);
    for (var row = 0; row < size; row++) {
      board[col].push(null);
    }
  }

  return board;
}

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
