const canvas = document.getElementById('game')
const mouse = require('./mouse')
const saveGame = require('./saveGame')

module.exports = function (game) {
  canvas.addEventListener('click', function () {
    game.play(mouse.row, mouse.col)
    saveGame(game)
  })
}
