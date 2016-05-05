const canvas = document.getElementById('game')
const mouse = require('./mouse')

module.exports = function (game) {
  canvas.addEventListener('mousemove', function (e) {
    const cellSize = canvas.width / game.board.size
    mouse.col = Math.floor(e.offsetX / cellSize)
    mouse.row = Math.floor(e.offsetY / cellSize)
  })
}
