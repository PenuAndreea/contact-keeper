const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

const User = require('../models/User')

// instead of app.post -> router.post
// @route       POST api/users
// @desc        Register a user
// @access      Public
router.post(
  '/',
  [
    check('name', 'Please add name')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // check if the user already exists
    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ msg: 'User already exists' })
      }

      // Create a new user
      user = new User({
        name,
        email,
        password
      })

      // encrypt the password
      // 10 is the default: how safe the password is
      const salt = await bcrypt.genSalt(10)
      // gives us a hash version of the password
      user.password = await bcrypt.hash(password, salt)
      // save to database
      await user.save()
      // object we want to send in the token
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
      res.status(500).send('Server Error')
    }
  }
)

// Export the router
module.exports = router
