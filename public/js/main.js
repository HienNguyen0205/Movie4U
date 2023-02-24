/* Changing the background color of the header when the user scrolls down. */
const header = document.getElementsByClassName('header')
window.addEventListener('scroll', e => {
    if (this.scrollY >= 30) {
        header[0].style.backgroundColor = '#000000'
    } else {
        header[0].style.backgroundColor = 'rgba(238, 238, 238, 0.3)'
    }
})

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
    if(e.target.id === 'sign_in'){
        signInModal.classList.add('modal_show')
    }else{
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
    if(e.target.innerText === 'Sign up'){
        signInModal.classList.remove('modal_show')
        signUpModal.classList.add('modal_show')
    }else{
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
    emailSignInErrMess.innerHTML = ''
    passSignInErrMess.innerHTML = ''
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
    if(emailRegex.test(email) && passwordRegex.test(password)){
        signInForm.submit()
    }else{
        if(email === ''){
            emailSignInErrMess.innerText = 'Please enter your email'
        }else if(emailRegex.test(email)){
            emailSignInErrMess.innerText = 'Email is not valid'
        }else{
            emailSignInErrMess.innerText = ''
        }
        if(password === ''){
            passSignInErrMess.innerText = 'Please enter your password'
        }else if(passwordRegex.test(password)){
            passSignInErrMess.innerText = 'Password need at least eight characters, one letter and one number'
        }else{
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
    if(emailRegex.test(email) && passwordRegex.test(pass) && name !== '' && pass === confirmPass) {
        signUpForm.submit()
    }else{
        if(name === ''){
            nameErrorMess.innerText = 'Please enter your name'
        }else{
            nameErrorMess.innerText = ''
        }
        if(email === ''){
            emailSignUpErrMess.innerText = 'Please enter your email'
        }else if(emailRegex.test(email)){
            emailSignUpErrMess.innerText = 'Email is not valid'
        }else{
            emailSignUpErrMess.innerText = ''
        }
        if(pass === ''){
            passSignUpErrMess.innerText = 'Please enter your password'
        }else if(passwordRegex.test(pass)){
            passSignUpErrMess.innerText = 'Password need at least eight characters, one letter and one number'
        }else{
            passSignUpErrMess.innerText = ''
        }
        if(confirmPass === ''){
            confirmPassSignUpErrMess.innerText = 'Please enter confirm password'
        }else if(confirmPass !== password){
            confirmPassSignUpErrMess.innerText = 'Wrong confirm password'
        }else{
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
        if(isShowPass){
            signInForm.elements['password_sign_in'].setAttribute('type', 'password');
            element.firstChild.classList.add('fa-eye')
            element.firstChild.classList.remove('fa-eye-slash')
        }else{
            signInForm.elements['password_sign_in'].setAttribute('type', 'text');
            element.firstChild.classList.add('fa-eye-slash')
            element.firstChild.classList.remove('fa-eye')
        }
        isShowPass = !isShowPass
    })
})