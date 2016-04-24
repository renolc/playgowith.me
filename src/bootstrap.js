/* global start */

const PouchDB = require('pouchdb')
const db = new PouchDB('go')
const game = require('go-sim')()

db.sync('https://renolc.cloudant.com/go')

start.addEventListener('click', function () {
  start.disabled = true
  const startText = start.innerText
  start.innerText = 'loading...'

  const blackId = generateId()
  const whiteId = generateId()

  db.put({
    _id: `${blackId}-${whiteId}`,
    game: game.serialize()
  })
    .then(function () {
      return db.sync('https://renolc.cloudant.com/go')
    })
    .then(function () {
      window.location = blackId
    })
    .catch(function (d) {
      start.disabled = false
      start.innerText = startText
    })
})

function generateId () {
  return Math.random().toString(16).slice(2)
}
