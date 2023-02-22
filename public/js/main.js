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
}