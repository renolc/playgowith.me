/* global start */

const PouchDb = require('pouchdb')
PouchDb.plugin(require('pouchdb-upsert'))

const generateId = require('./generateId')

const config = require('./config')
const db = new PouchDb(config.dbName)

start.addEventListener('click', function () {
  const gameId = generateId()
  const blackId = generateId()

  db.upsert(gameId, function (doc) {
    return {
      blackId: blackId,
      whiteId: generateId(),
      game: require('go-sim')().serialize()
    }
  }).then(function () {
    window.location.pathname = `${gameId}-${blackId}`
  })
})
