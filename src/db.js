const PouchDb = require('pouchdb')
PouchDb.plugin(require('pouchdb-upsert'))
const config = require('./config')

module.exports = new PouchDb(config.dbName)
