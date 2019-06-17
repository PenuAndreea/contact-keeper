const express = require('express')
const router = express.Router()

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get('/', (req, res) => {
  res.send('Get logged in user')
})

// @route       POST api/auth
// @desc        Auth user & get token
// @access      Public
// so that you can access private routes
router.post('/', (req, res) => {
  res.send('Log in user')
})

// Export the router
module.exports = router
