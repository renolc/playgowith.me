const metaData = require('./metaData')
const db = require('./db')

module.exports = function (game) {
  db.upsert(metaData.gameId, function (doc) {
    doc.game = game.serialize()
    return doc
  })
}
