const express = require('express')
const connectDB = require('./config/db')

const app = express()

// Connect Database
connectDB()

// Init Middleware
// by doing this we can now accept data, and don't need body parser
app.use(
  express.json({
    extended: false
  })
)

app.get('/', (req, res) =>
  res.json({ msg: 'Welcome to the contact keeper API...' })
)

// Define our routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contacts', require('./routes/contacts'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
