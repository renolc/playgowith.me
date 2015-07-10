Player = new Mongo.Collection('player');

Player.helpers({
  gameCursor: function() {
    return Game.find(this.gameId);
  },

  game: function() {
    return this.gameCursor(this.gameId).fetch()[0];
  }
});
