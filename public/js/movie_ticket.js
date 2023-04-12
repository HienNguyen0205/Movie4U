window.removeEventListener('scroll', scrollHandler)
header[0].style.backgroundColor = '#000000'
header[0].style.position = 'static'

/* The above code is adding an event listener to each element with the class name buy_ticket_step. When
the element is clicked, the code checks if the index of the clicked element is less than the index
of the element with the class name buy_ticket_step-active. If it is, the code adds the class name
buy_ticket_step-active to the clicked element and removes it from the element with the class name
buy_ticket_step-active. The code also displays the element with the index of the clicked element and
hides the element with the index of the element with */
const buyTicketStep = document.querySelectorAll('.buy_ticket_step')
const buyTicketSection = document.querySelectorAll('.movie_ticket_main')
let activeIndex = 0

const changeTicketSection = (from, to) => {
    buyTicketStep[to].classList.add('buy_ticket_step-active')
    buyTicketStep[from].classList.remove('buy_ticket_step-active')
    buyTicketSection[to].classList.remove('d-none')
    buyTicketSection[from].classList.add('d-none')
    activeIndex = to
}

formatCategory = category => {
    let words = category.split(',')
    let formattedStr = ''
    for (let i = 0; i < words.length; i++) {
        let word = words[i].trim()
        formattedStr += word + ' | '
    }
    formattedStr = formattedStr.slice(0, -3)
    return formattedStr
}

buyTicketStep.forEach((element, index) => {
    element.addEventListener('click', () => {
        if (index < activeIndex) {
            changeTicketSection(activeIndex, index)
        }
    })
})

/* Creating a seat layout for a theater. */
const seatLayoutElement = document.querySelector('#seat_layout')
const seatOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    for (let i = 0; i < 12; i++) {
        if (i === 7) {
            seatLayoutElement.insertAdjacentHTML('beforeend', '<div class="seat_layout_row d-flex mt-3"></div>')
        } else {
            seatLayoutElement.insertAdjacentHTML('beforeend', '<div class="seat_layout_row d-flex"></div>')
        }
        let lastRow = document.querySelector('.seat_layout_row:last-child')
        lastRow.insertAdjacentHTML('beforeend', `<div class="seat_order" style="top: ${i >= 7 ? 36 * i + 22 : 36 * i + 6}px;">${seatOrder[i]}</div>`)
        for (let j = 0; j < 17; j++) {
            if ((i === 0 && j === 11) || (i === 1 && j === 13) || (i < 7 && j === 15)) {
                break
            } else {
                lastRow.insertAdjacentHTML('beforeend', `<div class="seat_item seat_item-empty ${seatOrder[i] + (j + 1)}_seat" data-row="${seatOrder[i]}" data-seat="${j + 1}">${j + 1}</div>`)
            }
        }
    }


const theaterElement = document.querySelectorAll('.theater_item')
theaterElement.forEach(element => {
    element.addEventListener('click', () => {
        const time = element.getAttribute('data-time')
        const theater = element.parentNode.getAttribute('data-theater')
        localStorage.setItem('time', time)
        localStorage.setItem('theater', theater)
        changeTicketSection(0, 1)
    })
})

const ticketContainer = document.querySelector('#ticket_wrap')
const seats = document.querySelectorAll('.seat_item')
const totalTicketPrice = document.querySelector('#total_ticket_item')
const ticketCancel = document.querySelectorAll('.cancel_ticket_btn')
const nextStepBtn = document.querySelectorAll('.next_step_ticket_btn')
let ticketList = []

const checkTicketContainer = () => {
    if (ticketContainer.childNodes.length === 0) {
        totalTicketPrice.style.display = 'none'
        ticketCancel[0].style.display = 'none'
        nextStepBtn[0].style.display = 'none'
    } else {
        totalTicketPrice.style.display = 'block'
        ticketCancel[0].style.display = 'block'
        nextStepBtn[0].style.display = 'block'
    }
}
checkTicketContainer()

const deleteTicketItem = seatId => {
    const ticket = document.querySelector(`.${seatId}_ticket`)
    const seat = document.querySelector(`.${seatId}_seat`)
    if (seat.classList.contains('seat_item-selected')) {
        ticket.remove()
        seat.classList.remove('seat_item-selected')
        seat.classList.add('seat_item-empty')
        checkTicketContainer()
    }
}

const saveSeatSelected = (seat, action) => {
    const init = JSON.parse(localStorage.getItem('ticketSelected'))
    if (action === 'add') {
        if (init) {
            localStorage.setItem('ticketSelected', JSON.stringify([...init, seat]))
        } else {
            localStorage.setItem('ticketSelected', JSON.stringify([seat]))
        }
    } else if (action === 'remove') {
        init.splice(init.indexOf(seat), 1)
        localStorage.setItem('ticketSelected', JSON.stringify(init))
    } else {
        localStorage.removeItem('ticketSelected')
    }
}

seats.forEach(element => {
    element.addEventListener('click', () => {
        let ticketItem = document.querySelectorAll('.ticket_item')
        const row = element.getAttribute('data-row')
        const seatOrder = element.getAttribute('data-seat')
        if (element.classList.contains('seat_item-empty') && ticketItem.length < 6) {
            ticketContainer.insertAdjacentHTML('afterbegin',
                `<div class="ticket_item ${row + seatOrder}_ticket">
                    <p class="d-flex align-items-center">Row<span class="fs-4 fw-semibold mx-2">${row}</span></p>
                    <p class="d-flex align-items-center">Seat<span class="fs-4 fw-semibold mx-2">${seatOrder}</span></p>
                    <p class="text-secondary-emphasis fs-5">$35</p>
                    <i class="fa-solid fa-xmark text-white fs-4 delete_ticket_item" onclick="deleteTicketItem('${row + seatOrder}')"></i>
                </div>`
            )
            element.classList.remove('seat_item-empty')
            element.classList.add('seat_item-selected')
            checkTicketContainer()
            saveSeatSelected(row + seatOrder, 'add')
        } else if (element.classList.contains('seat_item-selected')) {
            deleteTicketItem(row + seatOrder)
            saveSeatSelected(row + seatOrder, 'remove')
        }
    })
})

const cancelSeatBtn = document.querySelector('#cancel_seat_btn')
const nextStepSeatBtn = document.querySelector('#next_seat_btn')

cancelSeatBtn.addEventListener('click', () => {
    localStorage.removeItem('ticketSelected')
    ticketContainer.innerHTML = ''
    changeTicketSection(1, 0)
    const selectedSeat = document.querySelectorAll('.seat_item-selected')
    selectedSeat.forEach(element => {
        element.classList.remove('seat_item-selected')
        element.classList.add('seat_item-empty')
    })
    checkTicketContainer()
})

nextStepSeatBtn.addEventListener('click', () => {
    changeTicketSection(1, 2)
})

const increaseFood = document.querySelectorAll('.increase_quantity_food')
const decreaseFood = document.querySelectorAll('.decrease_quantity_food')

increaseFood.forEach(element => {
    element.addEventListener('click', () => {
        const quantityEle = element.previousElementSibling
        const quantity = Number.parseInt(quantityEle.innerHTML)
        if (quantity < 9) {
            quantityEle.innerHTML = quantity + 1
        }
    })
})

decreaseFood.forEach(element => {
    element.addEventListener('click', () => {
        const quantityEle = element.nextElementSibling
        const quantity = Number.parseInt(quantityEle.innerHTML)
        if (quantity > 0) {
            quantityEle.innerHTML = quantity - 1
        }
    })
})

const nextFoodBtn = document.querySelector('#next_food_btn')

nextFoodBtn.addEventListener('click', () => {
    changeTicketSection(2, 3)
})

const movieInfo = document.querySelector('#movie_info')

const renderMovieInfo = () => {
    const data = JSON.parse(localStorage.getItem('movieInfo'))
    console.log(data)
    movieInfo.insertAdjacentHTML('beforeend', `
        <image id="movie_ticket_poster" src="${data.image}" alt="" />
        <div class="flex-grow-1">
            <div class="d-flex align-items-center">
                <h1 id="movie_ticket_title">${data.name}</h1>
                <div id="age_restrict">${data.age_restrict}</div>
            </div>
            <p class="py-1"><span class="text-hightlight">Director: </span>${data.director}</p>
            <p class="py-1"><span class="text-hightlight">Main cast: </span>${data.actors}</p>
            <p class="py-1"><span class="text-hightlight">Release day: </span>${formatDateTime(data.release_date)}</p>
            <p class="py-1"><span class="text-hightlight">Duration: </span>${data.duration} min</p>
            <p class="py-1"><span class="text-hightlight">Genres: </span>${formatCategory(data.categories)}</p>
            <p class="py-1">
                <span class="text-hightlight">Storyline: </span>A kind-hearted street urchin Aladdin vies for the love
                of the beautiful princess Jasmine, the princess of Agrabah. When he finds a magic lamp, he uses the
                genie's magic power to make himself a prince in order to marry her. He's also on a mission to stop the
                powerful Jafar who plots to steal the magic lamp that could make his deepest wishes come true.8
            </p>
            <button id="trailer_btn" class="position-relative btn_config" data-bs-toggle="modal" data-bs-target="#trailer"
                style="background-color: var(--pri-btn-color);" data-link="${formatTrailerLink(data.trailer)}">
                <div class="custom_btn">
                    Watch trailer
                </div>
            </button>
        </div>
    `)
}

renderMovieInfo()