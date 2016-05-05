const canvas = document.getElementById('game')
const mouse = require('./mouse')
const saveGame = require('./saveGame')
const isMyTurn = require('./isMyTurn')

module.exports = function (game) {
  canvas.addEventListener('click', function () {
    if (isMyTurn(game)) {
      game.play(mouse.row, mouse.col)
      saveGame(game)
    }
  })
}
