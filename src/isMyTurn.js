const metaData = require('./metaData')

module.exports = function (game) {
  return metaData.playerId === metaData[`${game.turn}Id`]
}
