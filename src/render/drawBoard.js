const game = require('../game')

const canvas = require('./canvas')
const ctx = require('./ctx')
const drawSquare = require('./drawSquare')
const drawCircle = require('./drawCircle')

module.exports = () => {
  ctx.beginPath()
  ctx.fillStyle = '#b88a2e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const d = canvas.width / game.board.size
  for (var x = d / 2; x < canvas.width - d; x += d) {
    for (var y = d / 2; y < canvas.width - d; y += d) {
      drawSquare(x, y, d)
    }
  }

  for (x = 0; x < game.board.size; x++) {
    for (y = 0; y < game.board.size; y++) {
      const cell = game.board.at(y, x)
      if (!cell.is('empty')) {
        drawCircle(
          x * d,
          y * d,
          cell.value
        )
      }
    }
  }
}
