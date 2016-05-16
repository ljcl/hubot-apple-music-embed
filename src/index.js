'use strict'

const request = require('request')
const url = require('url')
const queryString = require('query-string')
const getUrls = require('get-urls')
const _ = require('lodash')

function resolveLink (link, cb) {
  request({ method: 'HEAD', url: link, followAllRedirects: true }, (err, response) => {
    if (!err) {
      link = response.request.href
      var parsed = {}
      var build = {}
      parsed.url = url.parse(link)
      parsed.split = parsed.url.pathname.split('/')
      parsed.query = queryString.parse(parsed.url.search)

      // The link should be itunes
      if (parsed.url.host === 'itunes.apple.com') {
        build.country = parsed.split[1]
        build.id = parsed.query.i || parsed.split[4].replace('id', '')
        build.type = parsed.query.i ? 'song' : 'album'

        // Only embed types available
        if (/(song|album)$/.test(build.type)) {
          var amEmbed = `https://tools.applemusic.com/embed/v1/${build.type}/${build.id}?country=${build.country}&at=1000lmQ6&wmode=opaque`
          cb(false, amEmbed)
        }
      }
    }
  })
}

module.exports = (robot) => {
  robot.hear(/(itunes|itun.es)/i, (res) => {
    // Get all the links from a message
    var links = getUrls(res.match.input)
    var linkCount = links.length
    var resp = ''

    // Loop through each link and convert link to an embed (if there are links)
    if (linkCount > 0) {
      _.each(links, (link, index) => {
        resolveLink(link, (err, result) => {
          if (!err) {
            resp += result
            if (index === linkCount - 1) {
              res.send(resp)
            } else {
              resp += '\n'
            }
          }
        })
      })
    }
  })
}
