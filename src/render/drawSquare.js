const ctx = require('./ctx')
const canvas = require('./canvas')

const game = require('../game')

module.exports = (x, y, size) => {
  ctx.beginPath()
  ctx.lineWidth = ((canvas.width / game.board.size) / 2) * 0.15
  ctx.rect(x, y, size, size)
  ctx.stroke()
}
