// Function add movie theatre
let btnAddTheatre = document.getElementById('btn_add-theatre')
let btnEditTheatre = document.getElementById('btn_edit-theatre')
var rIndex, theatresList = document.getElementById('list_theatres')
let checkboxTheatres = document.getElementsByName('checkboxTheatres')
let listTheatres = document.getElementById('list_theatres')
const formData = new FormData()

const addTheatresName = document.getElementById('theatre_name')
const addTheatresAddress = document.getElementById('theatre_address')
const addTheatresImg = document.getElementById('theatre_img')
const addTheatresBtn = document.getElementById('form_add-theatres')

const editTheatresLabel = document.getElementById('theatres_edit-label')
const editTheatresName = document.getElementById('theatre_name-edit')
const editTheatresAddress = document.getElementById('theatre_address-edit')
const editTheatresImg = document.getElementById('theatre_img-edit')
const editTheatresBtn = document.getElementById('form_edit-theatres')

addTheatresBtn.addEventListener('submit', function (event) {
  event.preventDefault();
  formData.append('name', addTheatresName.value);
  formData.append('address', addTheatresAddress.value);
  formData.append('image', addTheatresImg.files[0]);
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
  formData.append('id', editTheatresLabel.innerHTML.split(": ")[1]);
  formData.append('name', editTheatresName.value);
  formData.append('address', editTheatresAddress.value);
  formData.append('image', editTheatresImg.files[0]);
  axios.post('/admin/updateTheatre', formData, {
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

function getAllMovieTheatres() {
  axios.get('/admin/getAllTheatres')
    .then(res => {
      renderMovieTheatres(res.data.data)
      selectTheatreToEdit()
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
    <td><label class="content_checkbox-outer"><input type="checkbox" id="theatre1" class="content_checkbox"
                name="theatre1" value="Ben Tre Cinema"><span class="checkmark"></span></label></td>
    <td><button id="btn_open-edit" type="button" class="btn btn-outline-warning" data-bs-toggle="modal"
            data-bs-target="#theatres_edit-modal">Edit</button></td>
    </tr>
    `)
  });
}

function selectTheatreToEdit() {
  // console.log(listTheatres.rows.length)
  for (var i = 0; i < listTheatres.rows.length; i++) {
    listTheatres.rows[i].onclick = function () {
      editTheatresLabel.innerHTML = "Edit Theatre ID: " + this.cells[0].innerHTML
      editTheatresName.value = this.cells[1].innerHTML
      editTheatresAddress.value = this.cells[3].innerHTML
    }
  }
}


// // Function edit theatre
// function editTheatreTableRow() {
//   var name = document.getElementById('theatre_name-edit').value,
//     address = document.getElementById('theatre_address-edit').value
//   theatresList.rows[rIndex - 1].cells[1].innerHTML = name
//   theatresList.rows[rIndex - 1].cells[3].innerHTML = address
// }
// // Function delete selected theatres
// function checkSelectDelTheatre() {

//   for (var i = 0; i < checkboxTheatres.length; i++) {
//     if (checkboxTheatres[i].checked == true) {
//       theatresList.rows[i].classList.add('selected')
//     }
//     else {
//       theatresList.rows[i].classList.remove('selected')
//     }
//   }
// }
// function removeSelectedRow() {
//   checkSelectDelTheatre()
//   for (var i = 0; i < theatresList.rows.length; i++) {
//     if (theatresList.rows[i].classList.contains('selected')) {
//       theatresList.deleteRow(i)
//     }

//   }
// }