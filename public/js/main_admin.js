



// Change URL 
window.onload = function () {
  document.getElementById("dashboard_admin").addEventListener("click", () => {
    changeUrl("Dashboard")
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