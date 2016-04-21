/* global requestAnimationFrame */
// const router = require('./router')
const game = require('./game')

const canvas = require('./render/canvas')
const drawCircle = require('./render/drawCircle')
const drawBoard = require('./render/drawBoard')

drawBoard()

canvas.addEventListener('mousemove', (e) => {
  requestAnimationFrame(() => {
    const cellSize = canvas.width / game.board.size
    drawBoard()
    drawCircle(
      Math.floor(e.offsetX / cellSize) * cellSize,
      Math.floor(e.offsetY / cellSize) * cellSize,
      game.turn
    )
  })
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
