Player = new Mongo.Collection('player');

Player.create = function(gameId, isWhite) {
  var id = Player.insert({
    gameId: gameId,
    isWhite: isWhite
  });

  return Player.findOne(id);
};

Player.helpers({
  gameCursor: function() {
    return Game.find(this.gameId);
  },

  game: function() {
    return this.gameCursor(this.gameId).fetch()[0];
  },

  opponentId: function() {
    return this.isWhite ? this.game().blackId : this.game().whiteId;
  },

  isNotTurn: function () {
    return this.game().turn !== this._id;
  }
});
