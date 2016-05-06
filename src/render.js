/* global requestAnimationFrame, pass, propose, accept, reject, score */

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const mouse = require('./mouse')
const isMyTurn = require('./isMyTurn')
const metaData = require('./metaData')

if (window.innerWidth < window.innerHeight) {
  canvas.width = window.innerWidth * 0.85
  canvas.height = canvas.width
} else {
  canvas.height = window.innerHeight * 0.75
  canvas.width = canvas.height
}

module.exports = function (game) {
  function render () {
    const cellSize = canvas.width / game.board.size

    pass.disabled = !isMyTurn(game)
    propose.disabled = pass.disabled
    accept.disabled = pass.disabled
    reject.disabled = pass.disabled

    switch (game.phase) {
      case 'play':
        pass.classList.remove('hidden')
        propose.classList.add('hidden')
        accept.classList.add('hidden')
        reject.classList.add('hidden')
        break

      case 'mark':
        pass.classList.add('hidden')
        propose.classList.remove('hidden')
        accept.classList.remove('hidden')
        reject.classList.remove('hidden')

        propose.disabled = propose.disabled || (!metaData.newMarks && game.previousPlay.type === 'propose')
        accept.disabled = accept.disabled || (game.previousPlay.type !== 'propose')
        reject.disabled = accept.disabled
        break

      case 'end':
        pass.classList.add('hidden')
        propose.classList.add('hidden')
        accept.classList.add('hidden')
        reject.classList.add('hidden')
        score.innerText = JSON.stringify(game.score)
        score.classList.remove('hidden')
    }

    // draw board background
    ctx.beginPath()
    ctx.fillStyle = '#b88a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw grid
    for (var x = cellSize / 2; x < canvas.width - cellSize; x += cellSize) {
      for (var y = cellSize / 2; y < canvas.width - cellSize; y += cellSize) {
        drawSquare(y, x)
      }
    }

    // draw played pieces
    for (x = 0; x < game.board.size; x++) {
      for (y = 0; y < game.board.size; y++) {
        const cell = game.board.at(y, x)
        if (!cell.is('empty')) {
          drawCircle(y, x, cell.value)

          // draw red mark over marked pieces
          if (cell.marked) {
            drawCircle(y, x, 'red', 0.5)
          }
        }
      }
    }

    // draw hover piece
    if (game.phase === 'play' && mouse.col > -1 && isMyTurn(game)) {
      const cell = game.board.at(
        mouse.row,
        mouse.col
      )

      if (cell && cell.is('empty')) {
        ctx.save()
        ctx.globalAlpha = 0.5
        drawCircle(cell.row, cell.col, game.turn)
        ctx.restore()
      }
    }

    // draw previous play
    if (game.previousPlay.type && game.previousPlay.type === 'play') {
      // draw green mark over last piece played
      drawCircle(
        game.previousPlay.position[0],
        game.previousPlay.position[1],
        'green',
        0.5
      )

      // draw red marks over any captured pieces
      game.previousPlay.captured.forEach(function (c) {
        drawCircle(c.row, c.col, 'red', 0.5)
      })
    }
  }

  // start rendering
  requestAnimationFrame(render)

  function drawSquare (x, y) {
    const cellSize = canvas.width / game.board.size
    ctx.beginPath()
    ctx.lineWidth = (cellSize / 2) * 0.15
    ctx.rect(x, y, cellSize, cellSize)
    ctx.stroke()
  }

  function drawCircle (y, x, fillColor, scale) {
    const cellSize = canvas.width / game.board.size
    fillColor = fillColor || 'black'
    scale = scale || 1

    const halfCellSize = cellSize / 2
    const radius = halfCellSize * scale

    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.ellipse(
      (x * cellSize) + halfCellSize,
      (y * cellSize) + halfCellSize,
      radius, radius,
      Math.PI, 0, 2 * Math.PI
    )
    ctx.fill()
  }

  return canvas
}
