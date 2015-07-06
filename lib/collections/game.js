Game = new Mongo.Collection('game');

Meteor.methods({
  createGame: function () {
    var gameId  = Game.insert({});
    var blackId = Player.insert({ isWhite: false, gameId: gameId });
    var whiteId = Player.insert({ isWhite: true,  gameId: gameId });

    Game.update(gameId, {
      $set: {
        blackId: blackId,
        whiteId: whiteId
      }
    });

    return blackId;
  }
});
