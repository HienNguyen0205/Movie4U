const express = require('express')
const router_admin = express.Router()

router_admin.get('/Dashboard', (req, res) => {
    res.render('home_admin', {
        layout: 'mainLayout_admin',
        most_popular: [
            {src: '/images/Movie/aladdin.jpg', name: 'Aladindin', duration: '120 min'},
            {src: '/images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min'},
            {src: '/images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min'},
        ],
    })
})
router_admin.get('/MovieTheatres',(req, res) => {
    res.render('movieTheatres_admin', {
        layout: 'mainLayout_admin'
    })
})
router_admin.get('/Movies',(req, res) => {
    res.render('movies_admin', {
        layout: 'mainLayout_admin'
    })
})
module.exports = router_admin