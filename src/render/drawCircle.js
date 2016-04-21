const canvas = require('./canvas')
const ctx = require('./ctx')

const game = require('../game')

module.exports = (x, y, fillColor = 'black', radius, lineColor = 'black') => {
  radius = (canvas.width / game.board.size) / 2
  ctx.beginPath()
  ctx.strokeStyle = lineColor
  ctx.fillStyle = fillColor
  ctx.lineWidth = radius * 0.1
  const ld = (ctx.lineWidth / 2)
  ctx.ellipse(x + radius, y + radius, radius - ld, radius - ld, Math.PI, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
}
