/* Changing the background color of the header when the user scrolls down. */
const header = document.getElementsByClassName('header')
window.addEventListener('scroll', e => {
    if(this.scrollY >= 30){
        header[0].style.backgroundColor = '#eeeeee'
    }else{
        header[0].style.backgroundColor = 'rgba(238, 238, 238, 0.3)'
    }
})