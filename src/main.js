/* global pass, propose, accept, reject, score*/

const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))

const db = new PouchDB('go')
db.sync('https://renolc.cloudant.com/go')

const game = require('go-sim')()
const playerId = window.location.pathname.slice(1)
var isBlack
var canvas

db.query('find', {
  key: playerId,
  include_docs: true
})
  .then(function (d) {
    if (d.rows.length === 0) {
      window.location.pathname = ''
      return
    }

    const doc = d.rows[0].doc
    isBlack = playerId === doc.blackId
    game.load(doc.game)
    delete game.mouse
    game.id = d.rows[0].id

    canvas = require('./render')(game, isMyTurn)
    game.cellSize = canvas.width / game.board.size
    addEventListeners()
  })

function addEventListeners () {
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
    if (!isMyTurn()) return

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
        break

      default: // nop
    }
  })

  pass.addEventListener('click', function () {
    if (!isMyTurn()) return

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
}

function saveGame () {
  db.upsert(game.id, function (doc) {
    doc.game = game.serialize()
    return doc
  })
}

function isMyTurn () {
  return game.turn === (isBlack ? 'black' : 'white')
}
