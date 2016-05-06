/* global opponent */

const goSim = require('go-sim')
const config = require('./config')
const metaData = require('./metaData')
const db = require('./db')
const isMyTurn = require('./isMyTurn')

const render = require('./render')
const addOnClick = require('./addOnClick')
const addOnMouseMove = require('./addOnMouseMove')
const addOnMouseOut = require('./addOnMouseOut')
const addOnResize = require('./addOnResize')

const addOnButtonClick = require('./addOnButtonClick')

const path = window.location.pathname.slice(1).split('-')
const gameId = path[0]
const playerId = path[1]
var game = goSim()

metaData.gameId = gameId
metaData.playerId = playerId

render(game)
addOnClick(game)
addOnMouseMove(game)
addOnMouseOut(game)
addOnResize(game)
addOnButtonClick(game)

db.sync(config.remoteUrl, {
  live: true,
  retry: true,
  filter: function (doc) {
    if (doc._id === gameId) {
      if (!metaData.blackId) {
        metaData.blackId = doc.blackId
        metaData.whiteId = doc.whiteId
        metaData.opponentId = (metaData.playerId === metaData.blackId) ? metaData.whiteId : metaData.blackId
        opponent.value = `http://${window.location.hostname}/${gameId}-${metaData.opponentId}`
      }
      if (isMyTurn(game)) {
        metaData.newMarks = false
      }
      game.load(doc.game)
      render(game)
      return true
    }
  }
})

db.get(gameId)
  .then(function (doc) {
    metaData.blackId = doc.blackId
    metaData.whiteId = doc.whiteId
    metaData.opponentId = (metaData.playerId === metaData.blackId) ? metaData.whiteId : metaData.blackId
    opponent.value = `http://${window.location.hostname}/${gameId}-${metaData.opponentId}`
    game.load(doc.game)
    render(game)
  })
