const goSim = require('go-sim')
const config = require('./config')
const metaData = require('./metaData')
const db = require('./db')

const render = require('./render')
const addOnClick = require('./addOnClick')
const addOnMouseMove = require('./addOnMouseMove')
const addOnMouseOut = require('./addOnMouseOut')

const path = window.location.pathname.slice(1).split('-')
const gameId = path[0]
const playerId = path[1]
var game = goSim()

metaData.gameId = gameId
metaData.playerId = playerId

render(game)
addOnClick(game)
addOnMouseMove(game)
addOnMouseOut()

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
  .then(function (doc) {
    game.load(doc.game)
  })
