Game = new Mongo.Collection('game');

Meteor.methods({
  createGame: function() {
    var gameId  = Game.insert({});
    var blackId = Player.insert({ isWhite: false, gameId: gameId });
    var whiteId = Player.insert({ isWhite: true,  gameId: gameId });

    Game.update(gameId, {
      $set: {
        board: buildBoard(),
        turn: blackId,
        blackId: blackId,
        whiteId: whiteId
      }
    });

    return blackId;
  },

  play: function(playerId, position) {
    var player = Player.findOne(playerId);

    // ensure valid playerId
    check(player, Match.Where(function(x) {
      return typeof x !== 'undefined';
    }));

    var game = player.game();

    // ensure it is the player's turn
    check(playerId, Match.Where(function(x) {
      return game.turn === x;
    }));

    // ensure position is valid
    check(position, Match.Where(function(x) {
      return (x.col >= 0 && x.col < game.board.length) &&
             (x.row >= 0 && x.row < game.board.length) &&
             (game.board[x.col][x.row] === null);
    }));

    game.board[position.col][position.row] = player.isWhite;

    Game.update(game._id, {
      $set: {
        board: game.board,
        turn: (game.turn === game.blackId) ? game.whiteId : game.blackId
      }
    });
  },

  pass: function(playerId) {
    var player = Player.findOne(playerId);

    // ensure valid playerId
    check(player, Match.Where(function(x) {
      return typeof x !== 'undefined';
    }));

    var game = player.game();

    // ensure it is the player's turn
    check(playerId, Match.Where(function(x) {
      return game.turn === x;
    }));

    Game.update(game._id, {
      $set: {
        turn: (game.turn === game.blackId) ? game.whiteId : game.blackId
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
