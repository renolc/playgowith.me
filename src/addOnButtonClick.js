/* global pass, propose, reject, accept */

const isMyTurn = require('./isMyTurn')
const saveGame = require('./saveGame')

module.exports = function (game) {
  pass.addEventListener('click', function () {
    if (isMyTurn(game)) {
      game.pass()
      saveGame(game)
    }
  })

  propose.addEventListener('click', function () {
    if (isMyTurn(game)) {
      game.propose()
      game.previousPlay.type = 'propose'
      saveGame(game)
    }
  })

  reject.addEventListener('click', function () {
    if (isMyTurn(game)) {
      game.reject()
      game.previousPlay.type = 'reject'
      saveGame(game)
    }
  })

  accept.addEventListener('click', function () {
    if (isMyTurn(game)) {
      game.accept()
      saveGame(game)
    }
  })
}
