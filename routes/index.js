const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('ticket', {
        layout: 'mainLayout',
        carousel: [
            'images/Carousel/Film1.jpg',
            'images/Carousel/Film2.jpg',
            'images/Carousel/Film3.jpg',
        ]
    })
})

module.exports = router