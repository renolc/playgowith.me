const canvas = document.getElementById('game')

canvas.width = window.innerWidth * 0.95
canvas.style.margin = `${(window.innerWidth - canvas.width) / 2}px`
canvas.height = canvas.width

module.exports = canvas
