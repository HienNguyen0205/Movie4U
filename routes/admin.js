const express = require('express')
const router_admin = express.Router()
const  adminControllers = require('../controllers/AdminController')
const ticketControllers = require('../controllers/TicketController')
const middleware = require('../middlewares')

router_admin.get('/', (req, res) => {
    res.render('dashboard_admin', {
        layout: 'mainLayout_admin',
        script: '/js/dashboard_admin.js',
        most_popular: [
            {src: '/images/Movie/aladdin.jpg', name: 'Aladindin', duration: '120 min'},
            {src: '/images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min'},
            {src: '/images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min'},
        ],
    })
})
router_admin.get('/MovieTheatres',(req, res) => {
    res.render('movieTheatres_admin', {
        layout: 'mainLayout_admin',
        script: '/js/movietheatres_admin.js',
    })
})
router_admin.get('/Movies',(req, res) => {
    res.render('movies_admin', {
        layout: 'mainLayout_admin',
        script: '/js/movies_admin.js',
    })
})
router_admin.get('/ShowTiming',(req, res) => {
    res.render('showTiming_admin', {
        layout: 'mainLayout_admin',
        script: '/js/showTiming_admin.js',
    })
})
router_admin.get('/Combo',(req, res) => {
    res.render('combo_admin', {
        layout: 'mainLayout_admin',
        script: '/js/combo_admin.js',
    })
})
router_admin.get('/Users',(req, res) => {
    res.render('users_admin', {
        layout: 'mainLayout_admin',
        script: '/js/users_admin.js',
    })
})
router_admin.get('/Booking',(req, res) => {
    res.render('booking_admin', {
        layout: 'mainLayout_admin',
        script: '/js/booking_admin.js',
    })
})

router_admin.get('/getAllUser', adminControllers.getAllUser)
router_admin.get('/getRevenue', adminControllers.getRevenue)

router_admin.get('/getAllTheatres', adminControllers.getAllTheatres)
router_admin.get('/getTheatreById', adminControllers.getTheatreById)
router_admin.post('/addTheatre', adminControllers.addTheatre)
router_admin.post('/updateTheatre', adminControllers.updateTheatre)
router_admin.delete('/deleteTheatre', adminControllers.deleteTheatre)

router_admin.get('/getAllTicket', ticketControllers.getAllTicket)

router_admin.get('/getAllSchedule', adminControllers.getAllSchedule)
router_admin.post('/addSchedule', adminControllers.addScheduleMovie)

router_admin.post('/addFoodCombo', adminControllers.addFoodCombo)
router_admin.post('/updateFoodCombo', adminControllers.updateFoodCombo)
router_admin.delete('/deleteFoodCombo', adminControllers.deleteFoodCombo)

router_admin.get('/getAllMovie', adminControllers.getAllMovie)
router_admin.post('/addMovie', adminControllers.addMovie)
router_admin.post('/updateMovie', adminControllers.updateMovie)
router_admin.delete('/deleteMovie', adminControllers.deleteMovie)

module.exports = router_admin