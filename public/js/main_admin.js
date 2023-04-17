// Flash Message
const snackbarContainer = document.getElementById('snackbar-container');

function snackbar(type, msg, time){
  const para = document.createElement('P');
  para.classList.add('snackbar');
  para.innerHTML = `${msg} <span> &times </span>`;

  if(type === 'error'){
      para.classList.add('error');
  }
  else if(type ==='success'){
      para.classList.add('success');
  }
  else if(type ==='warning'){
      para.classList.add('warning');
  }
  else if(type ==='info'){
      para.classList.add('info');
  }

  snackbarContainer.appendChild(para);
  para.classList.add('fadeout');

  setTimeout(()=>{
          snackbarContainer.removeChild(para)
  }, time)

}

// Change URL 
window.onload = function () {
  document.getElementById("dashboard_admin").addEventListener("click", () => {
    changeUrl("")
  });

  document.getElementById("movieTheatres_admin").addEventListener("click", () => {
    changeUrl("MovieTheatres")
  });
  document.getElementById("movies_admin").addEventListener("click", () => {
    changeUrl("Movies")
  });
  document.getElementById("showTiming_admin").addEventListener("click", () => {
    changeUrl("ShowTiming")
  });
  document.getElementById("combo_admin").addEventListener("click", () => {
    changeUrl("Combo")
  });
  document.getElementById("users_admin").addEventListener("click", () => {
    changeUrl("Users")
  });
  document.getElementById("booking_admin").addEventListener("click", () => {
    changeUrl("Booking")
  });
};

// document.getElementById("movies_admin").onclick = changeUrl("Movies");
// document.getElementById("showTimings_admin").onclick = changeUrl("ShowTiming");
// document.getElementById("homePage_admin").onclick = changeUrl("HomePage");
// document.getElementById("users_admin").onclick = changeUrl("Users");
// document.getElementById("booking_admin").onclick = changeUrl("Booking");
// document.getElementById("expense_admin").onclick = changeUrl("Expense");
function changeUrl(str) {
  const href = window.location.href
  const currUrl = href.slice(0, href.lastIndexOf('/'))
  window.location.href = currUrl + '/' + str
  console.log(str)
}




// Function add movie