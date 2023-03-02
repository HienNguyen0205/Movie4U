const express = require('express')
const router_admin = express.Router()

router_admin.get('/', (req, res) => {
    res.render('home_admin', {
        layout: 'mainLayout_admin',
        most_popular: [
            {src: 'images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min'},
            {src: 'images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min'},
            {src: 'images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min'},
        ],
    })
})

module.exports = router_admin