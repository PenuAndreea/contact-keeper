// function that has access to the request and response cycle and the object
// every time we hit an endpoint we can fire off this middleware. Check if there is a token in the header
const jwt = require('jsonwebtoken')
const config = require('config')

// next: move on to the next piece of middleware
module.exports = function(req, res, next) {
  // Get token from the header
  // x-auth-token: key to the token inside the header
  const token = req.header('x-auth-token')

  // check if it doesn't exist: check if there is a token in the header
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
