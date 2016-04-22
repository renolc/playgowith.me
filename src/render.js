/* global requestAnimationFrame */

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

if (window.innerWidth < window.innerHeight) {
  canvas.width = window.innerWidth * 0.95
  canvas.height = canvas.width
} else {
  canvas.height = window.innerHeight * 0.90
  canvas.width = canvas.height
}

module.exports = function (game) {
  function render () {
    // draw board background
    ctx.beginPath()
    ctx.fillStyle = '#b88a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw grid
    for (var x = game.cellSize / 2; x < canvas.width - game.cellSize; x += game.cellSize) {
      for (var y = game.cellSize / 2; y < canvas.width - game.cellSize; y += game.cellSize) {
        drawSquare(y, x)
      }
    }

    // draw played pieces
    for (x = 0; x < game.board.size; x++) {
      for (y = 0; y < game.board.size; y++) {
        const cell = game.board.at(y, x)
        if (!cell.is('empty')) {
          drawCircle(y, x, cell.value)
        }
      }
    }

    // draw hover piece
    if (game.mouse) {
      const cell = game.board.at(
        Math.floor(game.mouse.y / game.cellSize),
        Math.floor(game.mouse.x / game.cellSize)
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

    // continue rendering
    requestAnimationFrame(render)
  }

  // start rendering
  requestAnimationFrame(render)

  function drawSquare (x, y) {
    ctx.beginPath()
    ctx.lineWidth = (game.cellSize / 2) * 0.15
    ctx.rect(x, y, game.cellSize, game.cellSize)
    ctx.stroke()
  }

  function drawCircle (y, x, fillColor, scale) {
    fillColor = fillColor || 'black'
    scale = scale || 1

    const halfCellSize = game.cellSize / 2
    const radius = halfCellSize * scale

    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.ellipse(
      (x * game.cellSize) + halfCellSize,
      (y * game.cellSize) + halfCellSize,
      radius, radius,
      Math.PI, 0, 2 * Math.PI
    )
    ctx.fill()
  }

  return canvas
}
