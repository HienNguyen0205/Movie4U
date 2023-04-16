const express = require('express')
const router = express.Router()
const UserControllers = require('../controllers/UserController')
const middleware = require('../middlewares')

router.get('/',(req, res) => {
    res.render('home', {
        layout: 'mainLayout',
        script: '/js/home.js',
        carousel: [
            {index: 0, src: '/images/Carousel/Babylon.jpg'},
            {index: 1, src: '/images/Carousel/Knock-at-the-Cabin.jpg'},
            {index: 2, src: '/images/Carousel/Missing.jpg'},
            {index: 3, src: '/images/Carousel/Shazam_-Fury-of-the-Gods.jpg'},
            {index: 4, src: '/images/Carousel/Titanic.jpg'},
        ],
    })
})

router.get('/movie', (req, res) => {
    res.render('movie', {
        layout: 'mainLayout',
        script: '/js/movie.js',
    })
})

router.get('/movieticket', (req, res) => {
    res.render('movieTicket', {
        layout: 'mainLayout',
        script: '/js/movie_ticket.js',
    })
})

router.get('/support', (req, res) => {
    res.render('support', {
        layout: 'mainLayout',
        script: '/js/support.js',
    })
})

router.post('/login', UserControllers.login)

router.post('/register', UserControllers.register)

router.get('/logout', middleware.verifyJWT, middleware.authForUserAndRedirect, UserControllers.logout)


module.exports = router