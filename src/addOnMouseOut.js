const canvas = document.getElementById('game')
const mouse = require('./mouse')

module.exports = function () {
  canvas.addEventListener('mouseout', function (e) {
    mouse.col = -1
    mouse.row = -1
  })
}
