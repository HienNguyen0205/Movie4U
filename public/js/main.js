const getLastPath = href => {
    return href.substring(href.lastIndexOf('/'))
}

const changePath = path => {
    const href = window.location.href
    const currPath = href.slice(0, href.lastIndexOf('/'))
    window.location.href = currPath + '/' + path
}

/* Changing the background color of the header when the user scrolls down. */
const header = document.getElementsByClassName('header')
const scrollHandler = e => {
    if (this.scrollY >= 30) {
        header[0].style.backgroundColor = '#000000'
    } else {
        header[0].style.backgroundColor = 'rgba(238, 238, 238, 0.3)'
    }
}
window.addEventListener('scroll', scrollHandler)

/* Adding an event listener to each trailer item. When the trailer item is clicked, it will set the src
of the iframe to the data-src attribute of the trailer item. Then it will play the video. */
const trailerIframe = document.getElementById('trailer_iframe')
const trailerClose = document.querySelectorAll('.btn-close')
const trailerItems = document.querySelectorAll('.trailer_item')
trailerItems.forEach(trailerItem => {
    trailerItem.addEventListener('click', () => {
        const src = trailerItem.getAttribute('data-src')
        trailerIframe.setAttribute('src', src)
        setTimeout(() => {
            trailerIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
        }, 1000)
    })
})
trailerClose.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        trailerIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
    })
})

const blurBG = document.getElementById('blur_bg')
const signInModal = document.getElementById('sign_in_modal')
const signUpModal = document.getElementById('sign_up_modal')
const signInForm = document.getElementById('sign_in_form')
const signUpForm = document.getElementById('sign_up_form')
const closeSignBtn = document.querySelectorAll('.close_sign_modal')
const signInBtn = document.getElementById('sign_in_btn')
const signUpBtn = document.getElementById('sign_up_btn')
const switchForm = document.querySelectorAll('.switch_sign')

const openSignHandle = e => {
    blurBG.style.display = 'block'
    if (e.target.id === 'sign_in') {
        signInModal.classList.add('modal_show')
    } else {
        signUpModal.classList.add('modal_show')
    }
}

const closeSignHandle = () => {
    blurBG.style.display = 'none'
    signInModal.classList.remove('modal_show')
    signUpModal.classList.remove('modal_show')
    resetInput()
}

const toggleSwitchForm = e => {
    if (e.target.innerText === 'Sign up') {
        signInModal.classList.remove('modal_show')
        signUpModal.classList.add('modal_show')
    } else {
        signUpModal.classList.remove('modal_show')
        signInModal.classList.add('modal_show')
    }
    resetInput()
}

blurBG.addEventListener('click', closeSignHandle)
closeSignBtn.forEach(element => {
    element.addEventListener('click', closeSignHandle)
})
signInBtn.addEventListener('click', openSignHandle)
signUpBtn.addEventListener('click', openSignHandle)
switchForm.forEach(element => {
    element.addEventListener('click', toggleSwitchForm)
})

const resetInput = () => {
    signInForm.reset()
    signUpForm.reset()
    emailSignInErrMess.innerText = ''
    passSignInErrMess.innerText = ''
    nameErrorMess.innerText = ''
    emailSignUpErrMess.innerText = ''
    passSignUpErrMess.innerText = ''
    confirmPassSignUpErrMess.innerText = ''
}

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

const emailSignInErrMess = document.getElementById('email_sign_in_error')
const passSignInErrMess = document.getElementById('password_sign_in_error')

/**
 * If the email and password are valid, submit the form. Otherwise, display an error message.
 */
const signInSubmitHandle = () => {
    const email = signInForm.elements['email_sign_in'].value.trim()
    const password = signInForm.elements['password_sign_in'].value.trim()
    if (emailRegex.test(email) && passwordRegex.test(password)) {
        signInForm.submit()
    } else {
        if (email === '') {
            emailSignInErrMess.innerText = 'Please enter your email'
        } else if (emailRegex.test(email)) {
            emailSignInErrMess.innerText = 'Email is not valid'
        } else {
            emailSignInErrMess.innerText = ''
        }
        if (password === '') {
            passSignInErrMess.innerText = 'Please enter your password'
        } else if (passwordRegex.test(password)) {
            passSignInErrMess.innerText = 'Password need at least eight characters, one letter and one number'
        } else {
            passSignInErrMess.innerText = ''
        }
    }
}

const nameErrorMess = document.getElementById('name_error')
const emailSignUpErrMess = document.getElementById('email_sign_up_error')
const passSignUpErrMess = document.getElementById('password_sign_up_error')
const confirmPassSignUpErrMess = document.getElementById('password_confirm_sign_up_error')

const signUpSubmitHandle = () => {
    const name = signUpForm.elements['full_name'].value.trim()
    const email = signUpForm.elements['email_sign_up'].value.trim()
    const pass = signUpForm.elements['password_sign_up'].value.trim()
    const confirmPass = signUpForm.elements['confirm_password'].value.trim()
    if (emailRegex.test(email) && passwordRegex.test(pass) && name !== '' && pass === confirmPass) {
        signUpForm.submit()
    } else {
        if (name === '') {
            nameErrorMess.innerText = 'Please enter your name'
        } else {
            nameErrorMess.innerText = ''
        }
        if (email === '') {
            emailSignUpErrMess.innerText = 'Please enter your email'
        } else if (emailRegex.test(email)) {
            emailSignUpErrMess.innerText = 'Email is not valid'
        } else {
            emailSignUpErrMess.innerText = ''
        }
        if (pass === '') {
            passSignUpErrMess.innerText = 'Please enter your password'
        } else if (passwordRegex.test(pass)) {
            passSignUpErrMess.innerText = 'Password need at least eight characters, one letter and one number'
        } else {
            passSignUpErrMess.innerText = ''
        }
        if (confirmPass === '') {
            confirmPassSignUpErrMess.innerText = 'Please enter confirm password'
        } else if (confirmPass !== password) {
            confirmPassSignUpErrMess.innerText = 'Wrong confirm password'
        } else {
            confirmPassSignUpErrMess.innerText = ''
        }
    }
}

signInForm.elements['sign_in_btn'].addEventListener('click', signInSubmitHandle)
signUpForm.elements['sign_up_btn'].addEventListener('click', signUpSubmitHandle)

/* A function that toggles the password field between text and password. */
const togglePass = document.querySelectorAll('.toggle_pass')
let isShowPass = false

togglePass.forEach(element => {
    element.addEventListener('click', () => {
        if (isShowPass) {
            signInForm.elements['password_sign_in'].setAttribute('type', 'password');
            element.firstChild.classList.add('fa-eye')
            element.firstChild.classList.remove('fa-eye-slash')
        } else {
            signInForm.elements['password_sign_in'].setAttribute('type', 'text');
            element.firstChild.classList.add('fa-eye-slash')
            element.firstChild.classList.remove('fa-eye')
        }
        isShowPass = !isShowPass
    })
})

/* Checking if the user is on the homepage or not. If the user is not on the homepage, the header will
have a black background and a static position. */
const blackHeaderRoute = ['/Movie', '/user/Movie', '/user/MovieTicket']
if (blackHeaderRoute.includes(window.location.pathname)) {
    header[0].style.backgroundColor = '#000000'
    window.removeEventListener('scroll', scrollHandler)
}

/* A loader. */
window.addEventListener('load', () => {
    const loader = document.querySelector("#loader")
    loader.classList.add('loader-hidden')
    loader.addEventListener('transitionend', () => {
        loader.remove()
    })
})

const navBtn = document.querySelectorAll('.nav_item')
const activeNav = document.querySelector('.nav-active').classList.remove('nav-active')
const navPaths = ['/Movie', '/Event', '/Support']
const homePaths = ['/', '/user']
if (homePaths.includes(window.location.pathname)) {
    navBtn[0].classList.add('nav-active')
} else {
    navBtn[navPaths.indexOf(getLastPath(window.location.href)) + 1].classList.add('nav-active')
}

/* This code is used to change the page when the user clicks on the navigation bar. */
navBtn.forEach(element => {
    element.addEventListener('click', () => {
        const path = element.innerText
        changePath(path)
    })
})

const listMovie = document.querySelector('#list_movie')
const movieTypeBtn = document.querySelectorAll('.movie_btn')
const currMovieList = document.querySelector('#currMovie')
const comingMovieList = document.querySelector('#comingMovie')

if (getLastPath(window.location.href) === '/Movie') {
    listMovie.innerHTML = currMovieList.innerHTML
}

movieTypeBtn.forEach((element, index) => {
    element.addEventListener('click', () => {
        const selectedMovieBtn = document.querySelector('.movie_btn-selected')
        if (!element.isSameNode(selectedMovieBtn)) {
            selectedMovieBtn.classList.remove('movie_btn-selected')
            element.classList.add('movie_btn-selected')
            listMovie.innerHTML = ''
            if (index === 0) {
                listMovie.innerHTML = currMovieList.innerHTML
            } else {
                listMovie.innerHTML = comingMovieList.innerHTML
            }
        }
    })
})

const viewMovieBtn = document.querySelectorAll('.buy_ticket_btn')
viewMovieBtn.forEach(element => {
    element.addEventListener('click', () => {
        const movie = element.parentNode.parentNode.getAttribute('data-movie')
        changePath('MovieTicket/' + movie.replace(' ', '-'))
    })
})

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
    buyTicketSection[to].classList.remove('d-none')
    buyTicketSection[from].classList.add('d-none')
}

buyTicketStep.forEach((element, index) => {
    element.addEventListener('click', () => {
        if (index < activeIndex) {
            element.classList.add('buy_ticket_step-active')
            buyTicketStep[activeIndex].classList.remove('buy_ticket_step-active')
            changeTicketSection(activeIndex, index)
            activeIndex = index
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
        changeTicketSection(activeIndex, 1)
        buyTicketStep[1].classList.add('buy_ticket_step-active')
        buyTicketStep[activeIndex].classList.remove('buy_ticket_step-active')
        activeIndex = 1
    })
})

const ticketContainer = document.querySelector('#ticket_wrap')
const seats = document.querySelectorAll('.seat_item')
const totalTicketPrice = document.querySelector('#total_ticket_item')
const ticketCancel = document.querySelectorAll('.cancel_ticket_btn')
const nextStepBtn = document.querySelectorAll('.next_step_ticket_btn')
let ticketList = []

const checkTicketContainer = () => {
    if(ticketContainer.childNodes.length === 0){
        totalTicketPrice.style.display = 'none'
        ticketCancel[0].style.display = 'none'
        nextStepBtn[0].style.display = 'none'
    }else{
        totalTicketPrice.style.display = 'block'
        ticketCancel[0].style.display = 'block'
        nextStepBtn[0].style.display = 'block'
    }
}
checkTicketContainer()

const deleteTicketItem = seatId => {
    const ticket = document.querySelector(`.${seatId}_ticket`)
    const seat = document.querySelector(`.${seatId}_seat`)
    console.log(`.${seatId}_seat`)
    ticket.remove()
    seat.classList.remove('seat_item-selected')
    seat.classList.add('seat_item-empty')
    checkTicketContainer()
}

seats.forEach(element => {
    element.addEventListener('click', () => {
        let ticketItem = document.querySelectorAll('.ticket_item')
        if (element.classList.contains('seat_item-empty') && ticketItem.length < 6) {
            const row = element.getAttribute('data-row')
            const seatOrder = element.getAttribute('data-seat')
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
        }
    })
})