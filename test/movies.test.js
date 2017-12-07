const expect = require('chai').expect
const movies = require('../lib/movies')

describe('OMDB Movies', function() {
  this.timeout(5000)
  it('gets movie description', done => {
    movies('back to the future').then(reply => {
      expect(reply.slice(0, 35)).to.equal('Back to the Future is a 1985 movie ')
      done()
    }).catch(done)
  })
  it('never displays N/A for runtime', done => {
    movies('Black Panther').then(reply => {
      expect(reply).to.not.match(/.+ It has a \d+ min runtime, .+/)
      done()
    }).catch(done)
  })
  it('never displays N/A for plot', done => {
    movies('Thor Ragnarok documentary').then(reply => {
      expect(reply).to.not.match(/.+ Here's the plot:\n.+/)
      done()
    }).catch(done)
  })
  it('does not break without ratings', done => {
    movies('The biography of Joseph Rex').then(reply => {
      expect(reply).to.equal('undefined is a undefined undefined. Genre is undefined.')
      done()
    }).catch(done)
  })
})
