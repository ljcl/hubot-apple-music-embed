'use strict'

var Robot = require('hubot/src/robot')
var TextMessage = require('hubot/src/message').TextMessage
var expect = require('chai').expect

describe('hubot', function () {
  var robot
  var user

  beforeEach(() => {
    // create new robot, without http, using the mock adapter
    robot = new Robot(null, 'mock-adapter', false, 'Hubot')

    // configure user
    user = robot.brain.userForId('1', {
      name: 'mocha',
      room: '#mocha'
    })

    robot.adapter.on('connected', () => {
      // load the module under test and configure it for the
      // robot.  This is in place of external-scripts
      require('../src/index')(robot)
    })

    robot.run()
  })

  afterEach(() => {
    robot.shutdown()
  })

  it('Return two apple music embed links', (done) => {
    robot.adapter.on('send', (envelope, strings) => {
      console.log(strings)
      expect(strings[0]).to.contain('https://tools.applemusic.com/embed/v1')
      done()
    })
    // Send a message to Hubot
    var message = 'you should check out these links from digitalism this is a good starter track: https://itun.es/au/isRUab?i=1085977741 and this is the whole album: https://itun.es/au/isRUab'
    robot.adapter.receive(new TextMessage(user, message))
  })
})
