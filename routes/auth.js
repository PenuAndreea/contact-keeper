const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

const User = require('../models/User')

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
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })
      // if email doesn't exist
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' })
      }
      // check if user passwords match
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' })
      }

      // if everything is ok we are going to get the user id
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 }, // 3600 = 1 hour
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ msg: 'Server Error' })
    }
  }
)

// Export the router
module.exports = router
