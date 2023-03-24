const express = require('express')
const router = express.Router()
const movieControllers = require('../controllers/MovieController')
router.get('/getAll', movieControllers.getAll)
module.exports = router