Meteor.publish('player', function(id) {
  return Player.find(id);
});

Meteor.publish('game', function(playerId) {
  return Game.find({
    $or: [
      { blackId: playerId },
      { whiteId: playerId }
    ]
  });
});

Meteor.publish('cluster', function(playerId) {
  var player = Player.findOne(playerId);
  return Cluster.find({
    gameId: player.gameId
  })
});
