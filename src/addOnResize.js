const canvas = document.getElementById('game')
const render = require('./render')

module.exports = function (game) {
  window.addEventListener('resize', function () {
    if (window.innerWidth < window.innerHeight) {
      canvas.width = window.innerWidth * 0.85
      canvas.height = canvas.width
    } else {
      canvas.height = window.innerHeight * 0.8
      canvas.width = canvas.height
    }
    render(game)
  })
}
