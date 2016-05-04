const goSim = require('go-sim')

const PouchDb = require('pouchdb')
PouchDb.plugin(require('pouchdb-upsert'))

const config = require('./config')
const db = new PouchDb(config.dbName)

const path = window.location.pathname.slice(1).split('-')
const gameId = path[0]

var game = goSim()
const canvas = require('./render')(game)

db.sync(config.remoteUrl, {
  live: true,
  retry: true,
  filter: function (doc) {
    if (doc._id === gameId) {
      game.load(doc.game)
      return true
    }
  }
})

db.get(gameId)
  .then((doc) => {
    game.load(doc.game)
  })

canvas.addEventListener('click', function () {
  console.log('click')
})
