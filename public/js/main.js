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
    trailerItem.addEventListener('click', async () => {
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
const blackHeaderRoute = ['/Movie','/user/Movie','/user/MovieTicket']
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
if(homePaths.includes(window.location.pathname)){
    navBtn[0].classList.add('nav-active')
}else{
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

if(getLastPath(window.location.href) === '/Movie'){
    listMovie.innerHTML = currMovieList.innerHTML
}

movieTypeBtn.forEach((element,index) => {
    element.addEventListener('click', () => {
        const selectedMovieBtn = document.querySelector('.movie_btn-selected')
        if(!element.isSameNode(selectedMovieBtn)){
            selectedMovieBtn.classList.remove('movie_btn-selected')
            element.classList.add('movie_btn-selected')
            listMovie.innerHTML = ''
            if(index === 0){
                listMovie.innerHTML = currMovieList.innerHTML
            }else{
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