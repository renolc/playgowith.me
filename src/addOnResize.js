const canvas = document.getElementById('game')

module.exports = function () {
  window.addEventListener('resize', function () {
    if (window.innerWidth < window.innerHeight) {
      canvas.width = window.innerWidth * 0.85
      canvas.height = canvas.width
    } else {
      canvas.height = window.innerHeight * 0.8
      canvas.width = canvas.height
    }
  })
}
