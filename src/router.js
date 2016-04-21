/* global location, history */

const getLocalPathname = require('local-links').getLocalPathname

const router = (url) => {
  if (location.pathname !== url) {
    history.pushState(null, null, url)
  }
}

// handle back/forward buttons
window.addEventListener('popstate', () => router(location.pathname))

// handle clicks
document.body.addEventListener('click', (e) => {
  // local links
  const pathname = getLocalPathname(e)
  if (pathname) {
    e.preventDefault()
    router(pathname)
    return
  }
})

module.exports = router
