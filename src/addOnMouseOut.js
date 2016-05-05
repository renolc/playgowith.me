const canvas = document.getElementById('game')
const mouse = require('./mouse')
const render = require('./render')
const isMyTurn = require('./isMyTurn')

module.exports = function (game) {
  canvas.addEventListener('mouseout', function (e) {
    if (isMyTurn(game)) {
      mouse.col = -1
      mouse.row = -1
      render(game)
    }
  })
}
