/* global location, history */

const getLocalPathname = require('local-links').getLocalPathname

const router = function (url) {
  if (location.pathname !== url) {
    history.pushState(null, null, url)
  }
}

// handle back/forward buttons
window.addEventListener('popstate', function () {
  router(location.pathname)
})

// handle clicks
document.body.addEventListener('click', function (e) {
  // local links
  const pathname = getLocalPathname(e)
  if (pathname) {
    e.preventDefault()
    router(pathname)
    return
  }
})

module.exports = router
