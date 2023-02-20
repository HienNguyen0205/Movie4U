/* Changing the background color of the header when the user scrolls down. */
const header = document.getElementsByClassName('header')
window.addEventListener('scroll', e => {
    if (this.scrollY >= 30) {
        header[0].style.backgroundColor = '#eeeeee'
    } else {
        header[0].style.backgroundColor = 'rgba(238, 238, 238, 0.3)'
    }
})

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