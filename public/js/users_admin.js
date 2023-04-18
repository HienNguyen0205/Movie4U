// Render All Users
var listUsers = document.getElementById('list_users')

function getAllUsers() {
    axios.get('/admin/getAllUser', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => {
            renderAllUsers(res.data.data)
        })
        .catch(err => {
            console.error(err)
        })
}
function renderAllUsers(data) {
    listUsers.innerHTML = ''
    data.forEach(element => {
        listUsers.insertAdjacentHTML('beforeend',
        `
        <tr>
                <th scope="row">${element.id}</th>
                <td>${element.name}</td>
                <td>${element.email}</td>
                <td>${element.phone}</td>
                <td>${element.address}</td>
                <td>${element.birthday}</td>
                <td>${element.createAt}</td>
            </tr>
        `)
    });
}
getAllUsers()