/* global location, history, window */

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

  const click = e.target.dataset.click
  if (click) {
    e.preventDefault()
    console.log(JSON.parse(click))
  }
})

module.exports = router
