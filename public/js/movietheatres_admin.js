// Function add movie theatre
let btnAddTheatre = document.getElementById('btn_add-theatre')
let btnEditTheatre = document.getElementById('btn_edit-theatre')
let btnDelTheatre = document.getElementById('btn_delete-theatre')
var rIndex, theatresList = document.getElementById('list_theatres')
let checkboxTheatres = document.getElementsByName('checkboxTheatres')
let listTheatres = document.getElementById('list_theatres')
const formData = new FormData()

const addTheatresName = document.getElementById('theatre_name')
const addTheatresAddress = document.getElementById('theatre_address')
const addTheatresImg = document.getElementById('theatre_img')
const addTheatresBtn = document.getElementById('form_add-theatres')
const addRoom2D3D = document.getElementById('2d3d_add')
const addRoomIMAX = document.getElementById('imax_add')
const addRoom4DX = document.getElementById('4dx_add')

const editTheatresLabel = document.getElementById('theatres_edit-label')
const editTheatresName = document.getElementById('theatre_name-edit')
const editTheatresAddress = document.getElementById('theatre_address-edit')
const editTheatresImg = document.getElementById('theatre_img-edit')
const editTheatresBtn = document.getElementById('form_edit-theatres')
const editRoom2D3D = document.getElementById('2d3d_edit')
const editRoomIMAX = document.getElementById('imax_edit')
const editRoom4DX = document.getElementById('4dx_edit')

addTheatresBtn.addEventListener('submit', function (event) {
  event.preventDefault();
  formData.append('name', addTheatresName.value);
  formData.append('address', addTheatresAddress.value);
  formData.append('image', addTheatresImg.files[0]);
  formData.append('R2D_3D', addRoom2D3D.value);
  formData.append('RIMAX', addRoomIMAX.value);
  formData.append('R4DX', addRoom4DX.value);
  axios.post('/admin/addTheatre', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    console.log(response);
  }).catch(error => {
    console.error(error);
  });
  window.location.reload();
})

editTheatresBtn.addEventListener('submit', function (event) {
  event.preventDefault();
  formData.append('id', editTheatresLabel.getAttribute('theatre_id'));
  formData.append('name', editTheatresName.value);
  formData.append('address', editTheatresAddress.value);
  if (editTheatresImg.value === '') {
    console.log('File is empty')
  }
  else {
    formData.append('image', editTheatresImg.files[0]);
  }
  axios.post('/admin/updateTheatre', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  }).then(response => {
    console.log(response);
  }).catch(error => {
    console.error(error);
  });
  window.location.reload();
})

function getAllMovieTheatres() {
  axios.get('/admin/getAllTheatres', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
    .then(res => {
      renderMovieTheatres(res.data.data)
    })
    .catch(err => {
      console.error(err)
    })
}

getAllMovieTheatres()
function renderMovieTheatres(data) {
  listTheatres.innerHTML = ''
  data.forEach(element => {
    listTheatres.insertAdjacentHTML('beforeend', `
    <tr>
    <td scope="row">${element.id}</td>
    <td>${element.name}</td>
    <td><img class="theatres_img" src="${element.image}" alt=""></td>
    <td>${element.address}</td>
    <td><label class="content_checkbox-outer"><input type="checkbox" class="content_checkbox"
                name="theatre_checkbox" value="${element.id}"><span class="checkmark"></span></label></td>
    <td><button id="btn_open-edit" type="button" class="btn btn-outline-warning" data-bs-toggle="modal"
            data-bs-target="#theatres_edit-modal" onclick="selectTheatreToEdit(${element.id})">Edit</button></td>
    </tr>
    `)
  });
}

function selectTheatreToEdit(id) {
  axios.get('/admin/getTheatreById?theatre_id=' + id, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
    .then(res => {
      const data = res.data.data[0]
      editTheatresLabel.innerHTML = "Edit Theatre Id: " + data.theatre_id
      editTheatresLabel.setAttribute('theatre_id', data.theatre_id)
      editTheatresName.value = data.theatre_name
      editTheatresAddress.value = data.theatre_address
      editRoom2D3D.value = data.R2D_3D
      editRoomIMAX.value = data.R4DX
      editRoom4DX.value = data.RIMAX
      console.log(res.data.data[0])
    })
    .catch(err => {
      console.error(err)
    })
}
const listTheatreCheckbox = document.getElementsByName('theatre_checkbox');

// DELETE
function getDeleteTheatreCheckboxSelected() {
  const listTheatreCheckboxSelected = []
  for (let i = 0; i < listTheatreCheckbox.length; i++) {
    if (listTheatreCheckbox[i].checked) {
      listTheatreCheckboxSelected.push(deleteTheatreSelected(listTheatreCheckbox[i].value));
    }
  }
  return listTheatreCheckboxSelected
}
function deleteTheatreSelected(id) {
  axios.delete('/admin/deleteTheatre?id=' + id, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
    .then(response => {
      console.log(response.data); // log the response data
    })
    .catch(error => {
      console.log(error); // log any errors
    });
}
btnDelTheatre.addEventListener('click', () => {
  Promise.all(getDeleteTheatreCheckboxSelected())
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    })
  window.location.reload()
})
