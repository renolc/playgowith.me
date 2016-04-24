/* global pass, propose, accept, reject, score*/

console.log()

const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))

const db = new PouchDB('go')
db.sync('https://renolc.cloudant.com/go')

const game = require('go-sim')()
db.query('find', {
  key: window.location.pathname.slice(1),
  include_docs: true
})
  .then(function (d) {
    game.load(d.rows[0].doc.game)
    game.cellSize = canvas.width / game.board.size
    delete game.mouse
    game.id = d.rows[0].id
  })

const canvas = require('./render')(game)

canvas.addEventListener('mousemove', function (e) {
  game.mouse = {
    x: e.offsetX,
    y: e.offsetY
  }
})

canvas.addEventListener('mouseout', function () {
  game.mouse = null
})

canvas.addEventListener('click', function (e) {
  switch (game.phase) {
    case 'play':
      game.play(
        Math.floor(e.offsetY / game.cellSize),
        Math.floor(e.offsetX / game.cellSize)
      )
      saveGame()
      break

    case 'mark':
      game.mark(
        Math.floor(e.offsetY / game.cellSize),
        Math.floor(e.offsetX / game.cellSize)
      )
      saveGame()
      break

    default: // nop
  }
})

pass.addEventListener('click', function () {
  game.pass()

  if (game.phase === 'mark') {
    pass.classList.add('hidden')
    propose.classList.remove('hidden')
  }
  saveGame()
})

propose.addEventListener('click', function () {
  game.propose()

  propose.classList.add('hidden')
  accept.classList.remove('hidden')
  reject.classList.remove('hidden')
  saveGame()
})

accept.addEventListener('click', function () {
  game.accept()

  accept.classList.add('hidden')
  reject.classList.add('hidden')

  score.classList.remove('hidden')
  score.innerText = `Black: ${game.score.black}
White: ${game.score.white}`
  saveGame()
})

reject.addEventListener('click', function () {
  game.reject()

  accept.classList.add('hidden')
  reject.classList.add('hidden')
  pass.classList.remove('hidden')
  saveGame()
})

function saveGame () {
  db.upsert(game.id, function (doc) {
    doc.game = game.serialize()
    return doc
  })
}
