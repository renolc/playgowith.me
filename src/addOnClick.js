const canvas = document.getElementById('game')
const mouse = require('./mouse')
const saveGame = require('./saveGame')
const isMyTurn = require('./isMyTurn')
const render = require('./render')
const metaData = require('./metaData')

module.exports = function (game) {
  canvas.addEventListener('click', function () {
    if (isMyTurn(game)) {
      switch (game.phase) {
        case 'play':
          game.play(mouse.row, mouse.col)
          saveGame(game)
          break

        case 'mark':
          game.mark(mouse.row, mouse.col)
          metaData.newMarks = true
          break
      }
      render(game)
    }
  })
}
