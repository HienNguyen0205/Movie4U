window.removeEventListener('scroll', scrollHandler)
header[0].style.backgroundColor = '#000000'
header[0].style.position = 'static'

const userInfoItem = document.querySelectorAll('.user_info_item')
const userInfo = JSON.parse(localStorage.getItem('userInfo'))

const saveUserInfo = () => {
    const name = document.querySelector('#full_name_profile')
    const phone = document.querySelector('#phone')
    const address = document.querySelector('#address')
    const birthday = document.querySelector('#birthday')
    axios.post('/updateUserInfo', {
        name : name.value,
        phone : phone.value,
        birthday : birthday.value,
        address : address.value
    }, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .catch(err => {
        console.error(err)
    })
}

const handleEditBtn = (input , btn) => {
    if(btn.children[0].classList.contains('fa-pencil')){
        btn.children[0].classList.remove('fa-pencil')
        btn.children[0].classList.add('fa-floppy-disk')
        input.disabled = false
    }else if(btn.children[0].classList.contains('fa-floppy-disk')){
        btn.children[0].classList.remove('fa-floppy-disk')
        btn.children[0].classList.add('fa-pencil')
        input.disabled = true
        saveUserInfo()
    }
}

userInfoItem.forEach((item,index) => {
    const curr = item.querySelector('input')
    const editBtn = item.querySelector('span')
    switch (index){
        case 0:
            curr.value = userInfo.name
            break
        case 1:
            curr.value = userInfo.email
            break
        case 2:
            curr.value = userInfo.phone
            break
        case 3:
            curr.value = userInfo.address
            break
        case 4:
            curr.value = userInfo.birthday
            break
    }
    editBtn.addEventListener('click', () => {
        handleEditBtn(curr, editBtn)
    })
})