// Function add movie theatre
let btnAddTheatre = document.getElementById('btn_add-theatre')
let btnEditTheatre = document.getElementById('btn_edit-theatre')
var rIndex, theatresList = document.getElementById('list_theatres')
let checkboxTheatres = document.getElementsByName('checkboxTheatres')
let count = 0;

function addTheatresTableRow() {
  count++;
  console.log(document.getElementById('theatre_img').value)
//   var name = document.getElementById('theatre_name').value,
//     img = document.getElementById('theatre_img').value.slice(12),
//     address = document.getElementById('theatre_address').value,
//     template = `
//             <tr>
//                 <th scope="row">${count}</th>
//                 <td>${name}</td>
//                 <td><img class="theatres_img" src="/images/Movie Theatres/${img}" alt=""></td>
//                 <td>${address}</td>
//                 <td><label class="theatres_checkbox-outer"><input type="checkbox" id="theatre1"
//                             class="theatres_checkbox" name="checkboxTheatres" value="${name}"><span
//                             class="checkmark"></span></label></td>
//                 <td><button type="button" class="btn btn-outline-warning" data-bs-toggle="modal"
//                 data-bs-target="#theatres_edit-modal">Edit</button></td>
//             </tr>
//   `
//   theatresList.innerHTML += template
  // selectTheatreToInput()
}

// function selectTheatreToInput() {
//   for (var i = 0; i < theatresList.rows.length; i++) {
//     theatresList.rows[i].onclick = function () {
//       rIndex = this.rowIndex
//       // console.log(rIndex)
//       document.getElementById('theatre_name-edit').value = this.cells[1].innerHTML
//       document.getElementById('theatre_address-edit').value = this.cells[3].innerHTML
//     }
//   }
// }
// selectTheatreToInput()
// Function edit theatre
function editTheatreTableRow() {
  var name = document.getElementById('theatre_name-edit').value,
    address = document.getElementById('theatre_address-edit').value
  theatresList.rows[rIndex - 1].cells[1].innerHTML = name
  theatresList.rows[rIndex - 1].cells[3].innerHTML = address
}
// Function delete selected theatres
function checkSelectDelTheatre() {
  
  for (var i = 0; i < checkboxTheatres.length; i++) {
    if (checkboxTheatres[i].checked == true) {
      theatresList.rows[i].classList.add('selected')
    }
    else {
      theatresList.rows[i].classList.remove('selected')
    }
  }
}
function removeSelectedRow() {
  checkSelectDelTheatre()
  for (var i = 0; i < theatresList.rows.length; i++) {
    if (theatresList.rows[i].classList.contains('selected')) {
      theatresList.deleteRow(i)
    }
   
  }
}