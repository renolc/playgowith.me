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
