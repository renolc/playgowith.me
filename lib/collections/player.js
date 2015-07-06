Player = new Mongo.Collection('player');

Player.helpers({
  game: function () {
    return Game.findOne(this.gameId);
  }
});
