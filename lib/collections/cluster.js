Cluster = new Mongo.Collection('cluster');

Cluster.create = function(playerId, initialCellPosition, liberties) {
  var player = Player.findOne(playerId);
  var id = Cluster.insert({
    gameId:    player.gameId,
    playerId:  playerId,
    cells:     [[initialCellPosition.col, initialCellPosition.row]],
    liberties: liberties
  });

  return Cluster.findOne(id);
};

Cluster.removeLiberty = function(gameId, fromId, position) {
  var liberty = [position.col, position.row];
  Cluster.update({
    gameId:    gameId,
    playerId:  fromId,
    liberties: liberty
  }, {
    $pull: {
      liberties: liberty
    }
  }, {
    multi: true
  });
};

Cluster.getByLiberty = function(gameId, playerId, position) {
  return Cluster.find({
    gameId:    gameId,
    playerId:  playerId,
    liberties: [position.col, position.row]
  });
};

Cluster.getNextToCell = function(gameId, playerId, cell) {
  return Cluster.find({
    gameId:   gameId,
    playerId: playerId,
    cells: { $in: [
      [cell[0] - 1, cell[1]],
      [cell[0] + 1, cell[1]],
      [cell[0], cell[1] - 1],
      [cell[0], cell[1] + 1]
    ]}
  });
};

Cluster.getByGameId = function(gameId) {
  return Cluster.find({
    gameId: gameId
  });
};

Cluster.helpers({
  merge: function(clusters) {
    clusters.forEach(function (cluster) {

      cluster.cells.forEach(function (cell) {
        this.cells.push(cell);
      }, this);

      cluster.liberties.forEach(function (liberty) {
        this.liberties.push(liberty);
      }, this);

      Cluster.remove(cluster._id);
    }, this);

    Cluster.update(this._id, {
      $set: {
        cells:     this.cells
      },
      $addToSet: {
        liberties: { $each: this.liberties }
      }
    });

    Cluster.update(this._id, {
      $pullAll: {
        liberties: this.cells
      }
    });
  },

  addLiberty: function(liberty) {
    Cluster.update(this._id, {
      $addToSet: {
        liberties: liberty
      }
    });
  }
});
