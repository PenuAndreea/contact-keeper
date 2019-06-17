const express = require('express')
const router = express.Router()

// instead of app.post -> router.post
// @route       POST api/users
// @desc        Register a user
// @access      Public
router.post('/', (req, res) => {
  res.send('Register a user')
})

// Export the router
module.exports = router
