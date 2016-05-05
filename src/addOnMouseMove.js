const canvas = document.getElementById('game')
const mouse = require('./mouse')
const render = require('./render')
const isMyTurn = require('./isMyTurn')

module.exports = function (game) {
  canvas.addEventListener('mousemove', function (e) {
    if (isMyTurn(game)) {
      const cellSize = canvas.width / game.board.size
      mouse.col = Math.floor(e.offsetX / cellSize)
      mouse.row = Math.floor(e.offsetY / cellSize)
      render(game)
    }
  })
}
