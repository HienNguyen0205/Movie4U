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
        ],
        movies: [
            {src: 'images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min', category: 'action'},
            {src: 'images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min', category: 'action'},
            {src: 'images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min', category: 'action'},
            {src: 'images/Movie/cruella.jpg', name: 'Cruella', duration: '120 min', category: 'action'},
            {src: 'images/Movie/glass.jpg', name: 'Glass', duration: '120 min', category: 'action'},
            {src: 'images/Movie/no-time-to-die.jpg', name: 'No Time To Die', duration: '120 min', category: 'action'},
            {src: 'images/Movie/spider-man-far-from-home.jpg', name: 'Spiderman Far From Home', duration: '120 min', category: 'action'},
            {src: 'images/Movie/star-wars.jpg', name: 'Star War', duration: '120 min', category: 'action'},
            {src: 'images/Movie/thor.jpg', name: 'Thor', duration: '120 min', category: 'action'},
            {src: 'images/Movie/toy-story-4.jpg', name: 'Toy Story: 4', duration: '120 min', category: 'action'},
        ],
        comingMovies: [
            {src: 'images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: 'images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: 'images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: 'images/Movie/cruella.jpg', name: 'Cruella', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: 'images/Movie/glass.jpg', name: 'Glass', duration: '120 min', category: 'action', release: '02/05/2002'},
        ]
    })
})

module.exports = router