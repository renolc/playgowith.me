Player = new Mongo.Collection('player');

// create a new player for a game, and if it is white or not
Player.create = function(gameId, isWhite) {
  var id = Player.insert({
    gameId: gameId,
    isWhite: isWhite
  });

  return Player.findOne(id);
};

Player.helpers({

  // get reference to the game cursor
  gameCursor: function() {
    return Game.find(this.gameId);
  },

  // get reference to the game document
  game: function() {
    return this.gameCursor(this.gameId).fetch()[0];
  },

  // get our opponent's id
  opponentId: function() {
    return this.isWhite ? this.game().blackId : this.game().whiteId;
  },

  // if it is not our turn
  isNotTurn: function () {
    return this.game().turn !== this._id;
  },

  // if it is our turn
  isTurn: function () {
    return this.game().turn === this._id;
  }
});
