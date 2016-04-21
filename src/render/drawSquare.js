const ctx = require('./ctx')

module.exports = (x, y, size) => {
  ctx.beginPath()
  ctx.lineWidth = 3
  const ld = (ctx.lineWidth / 2)
  ctx.rect(x - ld, y - ld, size, size)
  ctx.stroke()
}
