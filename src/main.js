/* global location, history */

const PouchDb = require('pouchdb')
const local = new PouchDb('go')
const remote = 'https://renolc.cloudant.com/go/'

// local.sync(remote, {
//   live: true,
//   retry: true
// }).on('change', (delta) => {
//   console.log(delta)
// })

console.log(location.pathname)

window.addEventListener('popstate', () => {
  console.log(`diff: ${location.pathname}`)
})

history.pushState(null, null, 'bork')
