const express = require('express')
const router = express.Router()
const movieControllers = require('../controllers/MovieController')
router.get('/getAllMovies', movieControllers.getAllMovie)
router.get('/getMovieById', movieControllers.getMovieById)
router.get('/getMovieByName', movieControllers.getMovieByName)
router.get('/getAllPoster', movieControllers.getAllPoster)
module.exports = router