const canvas = require('./canvas')
const ctx = require('./ctx')

const game = require('../game')

module.exports = (x, y, fillColor = 'black') => {
  const radius = (canvas.width / game.board.size) / 2
  ctx.beginPath()
  ctx.fillStyle = fillColor
  ctx.ellipse(x + radius, y + radius, radius, radius, Math.PI, 0, 2 * Math.PI)
  ctx.fill()
}
