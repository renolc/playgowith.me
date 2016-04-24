/* global pass, propose, accept, reject, score*/

const game = require('go-sim')()

const canvas = require('./render')(game)

game.cellSize = canvas.width / game.board.size

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
  game.pass()

  if (game.phase === 'mark') {
    pass.classList.add('hidden')
    propose.classList.remove('hidden')
  }
})

propose.addEventListener('click', function () {
  game.propose()

  propose.classList.add('hidden')
  accept.classList.remove('hidden')
  reject.classList.remove('hidden')
})

accept.addEventListener('click', function () {
  game.accept()

  accept.classList.add('hidden')
  reject.classList.add('hidden')

  score.classList.remove('hidden')
  score.innerText = `Black: ${game.score.black}
White: ${game.score.white}`
})

reject.addEventListener('click', function () {
  game.reject()

  accept.classList.add('hidden')
  reject.classList.add('hidden')
  pass.classList.remove('hidden')
})
