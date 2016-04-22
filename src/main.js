const game = require('go-sim')()

const canvas = require('./render')(game)
const pass = document.getElementById('pass')

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
  game.play(
    Math.floor(e.offsetY / game.cellSize),
    Math.floor(e.offsetX / game.cellSize)
  )
})

pass.addEventListener('click', game.pass)
