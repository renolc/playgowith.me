/* global start */

const PouchDB = require('pouchdb')
const db = new PouchDB('go')

db.sync('https://renolc.cloudant.com/go', {
  live: true,
  retry: true
})

start.addEventListener('click', function () {
  const id = Math.random().toString(16).slice(2)
  db.put({
    _id: id
  }).then(function (d) {
    console.log(d.id)
  })
})
