const express = require('express')
const router = express.Router()
const UserControllers = require('../controllers/UserController')
const middleware = require('../middlewares')

router.get('/',(req, res) => {
    res.render('home', {
        layout: 'mainLayout',
        script: '/js/home.js',
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

router.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'mainLayout',
        script: '/js/profile.js',
    })
})

router.get('/history', (req,res) => {
    res.render('history', {
        layout: 'mainLayout',
        script: '/js/history.js',
    })
})

router.get('/theater', (req,res) => {
    res.render('theater', {
        layout: 'mainLayout',
        script: '/js/theater.js',
    })
})

router.post('/login', UserControllers.login)

router.post('/register', UserControllers.register)

router.get('/logout', UserControllers.logout)

router.post('/createOTP', UserControllers.createOTP)

router.post('/verifyOTP', UserControllers.verifyOTP)

router.post('resetPassword', UserControllers.resetPassword)

router.post('/updateUserInfo', middleware.verifyJWT , UserControllers.updateUserInfo)

router.post('/changePassword', middleware.verifyJWT , UserControllers.changePassword)


module.exports = router