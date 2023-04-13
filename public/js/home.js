const listTrailer = document.querySelector('#list_trailer')

const renderTrailer = data => {
    listTrailer.insertAdjacentHTML('beforeend', `
        <div class="trailer_item" data-bs-toggle="modal" data-bs-target="#trailer" data-src="${formatTrailerLink(data.trailer)}">
            <div class="trailer_poster_wrap">
                <img src="${data.image}" alt="trailer">
                <i class="fa-regular fa-circle-play"></i>
            </div>
            <h5>${data.name}</h5>
        </div>
    `)
}

const getLastedMovie = status => {
    axios.get('/movie/getAllMovies', {
        params: {
            status: status
        }
    })
        .then(res => {
            res.data.data.forEach((item, index) => {
                if (index < 5) {
                    if (status == 0) {
                        renderOpenMovie(item)
                    }else if (status == 1) {
                        renderComingMovie(item)
                    }
                }
            })
        })
        .catch(err => {
            console.error(err)
        })
}

renderTrailer({trailer: '', image: '/images/Carousel/Babylon.jpg', name: ''})
renderTrailer({trailer: '', image: '/images/Carousel/Babylon.jpg', name: ''})
renderTrailer({trailer: '', image: '/images/Carousel/Babylon.jpg', name: ''})

getLastedMovie(0)
getLastedMovie(1)