const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('home', {
        layout: 'mainLayout',
        carousel: [
            {index: 0, src: 'images/Carousel/Babylon.jpg'},
            {index: 1, src: 'images/Carousel/Knock-at-the-Cabin.jpg'},
            {index: 2, src: 'images/Carousel/Missing.jpg'},
            {index: 3, src: 'images/Carousel/Shazam_-Fury-of-the-Gods.jpg'},
            {index: 4, src: 'images/Carousel/Titanic.jpg'},
        ]
    })
})

module.exports = router