/* global requestAnimationFrame */
// const router = require('./router')
const game = require('./game')

const canvas = require('./render/canvas')
const ctx = require('./render/ctx')
const drawCircle = require('./render/drawCircle')
const drawBoard = require('./render/drawBoard')
game.play(0, 0)
game.play(0, 1)

drawBoard()

canvas.addEventListener('mousemove', (e) => {
  const cellSize = canvas.width / game.board.size
  const row = Math.floor(e.offsetY / cellSize)
  const col = Math.floor(e.offsetX / cellSize)

  const cell = game.board.at(row, col)
  if (cell.is('empty')) {
    requestAnimationFrame(() => {
      drawBoard()
      ctx.save()
      ctx.globalAlpha = 0.5
      drawCircle(col * cellSize, row * cellSize, game.turn)
      ctx.restore()
    })
  } else {
    drawBoard()
  }
})

canvas.addEventListener('mouseout', () => drawBoard())

canvas.addEventListener('click', (e) => {
  const cellSize = canvas.width / game.board.size
  game.play(
    Math.floor(e.offsetY / cellSize),
    Math.floor(e.offsetX / cellSize)
  )
  requestAnimationFrame(drawBoard)
})
