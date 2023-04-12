window.removeEventListener('scroll', scrollHandler)
header[0].style.backgroundColor = '#000000'
header[0].style.position = 'static'

const movieTypeBtn = document.querySelectorAll('.movie_btn')

openMovieContainer.style.display = 'grid'
comingMovieContainer.style.display = 'none'

let indexType = 0

movieTypeBtn.forEach((element, index) => {
    element.addEventListener('click', () => {
        const selectedMovieBtn = document.querySelector('.movie_btn-selected')
        indexType = index
        if (!element.isSameNode(selectedMovieBtn)) {
            selectedMovieBtn.classList.remove('movie_btn-selected')
            element.classList.add('movie_btn-selected')
            if (index === 0) {
                openMovieContainer.style.display = 'grid'
                comingMovieContainer.style.display = 'none'
            } else {
                openMovieContainer.style.display = 'none'
                comingMovieContainer.style.display = 'grid'
            }
        }
    })
})

const searchInput = document.querySelector('#movie_search_input')
const searchBtn = document.querySelector('#movie_search_btn')

const getAllMovie = status => {
    axios.get('/movie/getAllMovies', {
        params: {
            status: status
        }
    })
        .then(res => {
            if(status === 0){
                res.data.data.forEach(item => {
                    renderOpenMovie(item)
                })        
            }else if(status === 1){
                resetComingMovie()
                res.data.data.forEach(item => {
                    renderComingMovie(item)
                })
            }
        })
        .catch(err => {
            console.error(err)
        })
}
getAllMovie(0)
getAllMovie(1)

const getMovieByKeyWord = keyword => {
    axios.get('/movie/getMovieByName?name=' + keyword)
    .then(res => {
        const filter = res.data.data.filter(item => item.status == indexType)
        if(indexType == 0){
            resetOpenMovie()
            filter.forEach(item => {
                renderOpenMovie(item)
            })
        }else if(indexType == 1){
            resetComingMovie()
            filter.forEach(item => {
                renderComingMovie(item)
            })
        }
    })
}

searchBtn.addEventListener('click', () => {
    getMovieByKeyWord(searchInput.value)
})