Cluster = new Mongo.Collection('cluster');

// create a new cluster given a player, initial cell, and current liberties
Cluster.create = function(gameId, playerId, initialCellPosition, liberties) {
  var id = Cluster.insert({
    gameId:    gameId,
    playerId:  playerId,
    cells:     [[initialCellPosition.col, initialCellPosition.row]],
    liberties: liberties,
    dead:      false
  });

  return Cluster.findOne(id);
};

// remove a liberty from all clusters associated with a player
Cluster.removeLiberty = function(gameId, fromId, position) {
  var liberty = [position.col, position.row];
  Cluster.update({
    gameId:    gameId,
    playerId:  fromId,
    liberties: liberty,
    dead:      false
  }, {
    $pull: {
      liberties: liberty
    }
  }, {
    multi: true
  });
};

// get all clusters from a player that contain this liberty
Cluster.getByLiberty = function(gameId, playerId, position) {
  return Cluster.find({
    gameId:    gameId,
    playerId:  playerId,
    liberties: [position.col, position.row],
    dead:      false
  });
};

// get a cluster that contains a given cell position, if any
Cluster.getByCell = function(gameId, position) {
  return Cluster.findOne({
    gameId: gameId,
    cells: [position.col, position.row]
  });
};

// get all clusters from a player that are adjacent to this cell
Cluster.getNextToCell = function(gameId, playerId, cell) {
  return Cluster.find({
    gameId:   gameId,
    playerId: playerId,
    dead:     false,
    cells: { $in: [
      [cell[0] - 1, cell[1]],
      [cell[0] + 1, cell[1]],
      [cell[0], cell[1] - 1],
      [cell[0], cell[1] + 1]
    ]}
  });
};

Cluster.getByGame = function(gameId) {
  return Cluster.find({
    gameId: gameId,
    dead:   false
  });
};

Cluster.getDead = function(gameId) {
  return Cluster.find({
    gameId: gameId,
    dead: true
  });
};

Cluster.helpers({

  // get the associated game
  game: function() {
    return Game.findOne(this.gameId);
  },

  // return true if white
  isWhite: function() {
    return this.playerId === this.game().whiteId;
  },

  // merge this cluster with neighbor friendly clusters
  merge: function(clusters) {
    clusters.forEach(function (cluster) {

      // combine cells
      cluster.cells.forEach(function (cell) {
        this.cells.push(cell);
      }, this);

      // combine liberties
      cluster.liberties.forEach(function (liberty) {
        this.liberties.push(liberty);
      }, this);

      // remove merged cluster
      Cluster.remove(cluster._id);
    }, this);

    // update this merged cluster
    Cluster.update(this._id, {
      $set: {
        cells:     this.cells
      },
      $addToSet: {
        liberties: { $each: this.liberties }
      }
    });

    // make sure none of our liberties and cells collide
    Cluster.update(this._id, {
      $pullAll: {
        liberties: this.cells
      }
    });
  },

  // add a liberty to this cluster
  addLiberty: function(liberty) {
    Cluster.update(this._id, {
      $addToSet: {
        liberties: liberty
      }
    });
  },

  // mark this cluster as dead
  markDead: function() {
    Cluster.update(this._id, {
      $set: {
        dead: true
      }
    })
  },

  // toggle the dead state of this cluster
  toggleDead: function() {
    Cluster.update(this._id, {
      $set: {
        dead: !this.dead
      }
    });
  }
});
