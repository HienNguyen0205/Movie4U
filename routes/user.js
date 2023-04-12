const express = require('express')
const router = express.Router()

router.get('/home', (req, res) => {
    res.render('home', {
        layout: 'mainLayout',
        carousel: [
            {index: 0, src: '/images/Carousel/Babylon.jpg'},
            {index: 1, src: '/images/Carousel/Knock-at-the-Cabin.jpg'},
            {index: 2, src: '/images/Carousel/Missing.jpg'},
            {index: 3, src: '/images/Carousel/Shazam_-Fury-of-the-Gods.jpg'},
            {index: 4, src: '/images/Carousel/Titanic.jpg'},
        ],
        movies: [
            {src: '/images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min', category: 'action'},
            {src: '/images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min', category: 'action'},
            {src: '/images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min', category: 'action'},
            {src: '/images/Movie/cruella.jpg', name: 'Cruella', duration: '120 min', category: 'action'},
            {src: '/images/Movie/glass.jpg', name: 'Glass', duration: '120 min', category: 'action'},
        ],
        comingMovies: [
            {src: '/images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/cruella.jpg', name: 'Cruella', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/glass.jpg', name: 'Glass', duration: '120 min', category: 'action', release: '02/05/2002'},
        ],
        trailers: [
            {name: 'Ant-Man and The Wasp: Quantumania', poster: '/images/PosterTrailer/ant_man_wasp_quantumania.jpg', src: '/https://www.youtube.com/embed/s3UD3qvJdao?enablejsapi=1'},
            {name: 'Consectation', poster: '/images/PosterTrailer/consecration.jpg', src: '/https://www.youtube.com/embed/HRjG65M6L2c?enablejsapi=1'},
            {name: 'Argonuts', poster: '/images/PosterTrailer/argonuts.jpg', src: '/https://www.youtube.com/embed/LiVyhdxLYFc?enablejsapi=1'}
        ]
    })
})

router.get('/movie', (req, res) => {
    res.render('movie', {
        layout: 'mainLayout',
        script: '/js/movie.js',
        movies: [
            {src: '/images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min', category: 'action'},
            {src: '/images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min', category: 'action'},
            {src: '/images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min', category: 'action'},
            {src: '/images/Movie/cruella.jpg', name: 'Cruella', duration: '120 min', category: 'action'},
            {src: '/images/Movie/glass.jpg', name: 'Glass', duration: '120 min', category: 'action'},
            {src: '/images/Movie/no-time-to-die.jpg', name: 'No Time To Die', duration: '120 min', category: 'action'},
            {src: '/images/Movie/spider-man-far-from-home.jpg', name: 'Spiderman Far From Home', duration: '120 min', category: 'action'},
            {src: '/images/Movie/star-wars.jpg', name: 'Star War', duration: '120 min', category: 'action'},
            {src: '/images/Movie/thor.jpg', name: 'Thor', duration: '120 min', category: 'action'},
            {src: '/images/Movie/toy-story-4.jpg', name: 'Toy Story: 4', duration: '120 min', category: 'action'},
        ],
        comingMovies: [
            {src: '/images/Movie/aladdin.jpg', name: 'Aladdin', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/avenger-endgame.jpg', name: 'Avenger Endgame', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/captain-marvel.jpg', name: 'Captain Marvel', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/cruella.jpg', name: 'Cruella', duration: '120 min', category: 'action', release: '02/05/2002'},
            {src: '/images/Movie/glass.jpg', name: 'Glass', duration: '120 min', category: 'action', release: '02/05/2002'},
        ],
    })
})

router.get('/movieticket', (req, res) => {
    res.render('MovieTicket', {
        layout: 'mainLayout',
        script: '/js/movie_ticket.js',
    })
})

router.get('/event', (req, res) => {
    res.render('Event', {
        layout: 'mainLayout',
        
    })
})

module.exports = router