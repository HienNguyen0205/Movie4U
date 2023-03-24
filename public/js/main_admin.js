// // Chart Dashboard
const ctx = document.getElementById('dashboard-chart');
let currChart = [];
const chartToday = [20000, 40000, 55000, 35000, 10000, 14000, 14000, 24000, 34000, 26000, 13000, 44000];
const chartWeek = [10000, 55000, 40000, 25000, 35000, 36000, 33000, 24000, 26000, 18000, 28000, 30000];
const chartMonth = [57000, 24000, 12000, 45000, 10000, 34000, 28000, 35000, 43000, 13000, 30000, 29000];
const chartYear = [45000, 56000, 34000, 57000, 23000, 45000, 23000, 12000, 18000, 55000, 34000, 48000];
currChart = [...chartToday];
console.log(currChart)
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const chartDashboard = new Chart(ctx, {
  type: 'line',
  data: {
    labels: MONTHS,
    datasets: [{
      label: null,
      data: currChart,
      fill: true,
      borderWidth: 1,
      borderColor: "#9D8CEF",
      backgroundColor: "rgba(224, 153, 244, 0.5)"
    }]
  },
  options: {
    animations: {
      tension: {
        duration: 1000,
        esing: 'linear',
        from: 1,
        to: 0.5,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9D8CEF'
        }
      },
      y: {
        min: 0,
        max: 60000,
        ticks: {
          color: '#9D8CEF',
        }
      }
    },
    plugins: {
      legend: {
          display: false,
          labels: {
              font: {
                  size: 18,
              }
          }
      },
      tooltips: {
        callbacks: {
           label: function(tooltipItem) {
                  return tooltipItem.yLabel;
           }
        }
      }
    }
  }
});

// Time dashboard click 

function timeDashboardUnclick(x) {
  x.style.backgroundColor = '#7A75E8'
  x.style.color = '#FFFFFF'
}
function timeDashboardClick(x) {
  x.style.backgroundColor = '#485296'
  x.style.color = '#cccccc'
}

function todayClick() {
  currChart = [...chartToday]
  chartDashboard.data.datasets[0].data = [...currChart];
  chartDashboard.update();
  timeDashboardUnclick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("month"))
  timeDashboardClick(document.getElementById("year"))
};
function weekClick() {
  currChart = [...chartWeek]
  console.log(chartDashboard.data.datasets[0].data)
  chartDashboard.data.datasets[0].data = [...currChart];
  chartDashboard.update();
  timeDashboardUnclick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("month"))
  timeDashboardClick(document.getElementById("year"))
};
function monthClick() {
  currChart = [...chartMonth]
  chartDashboard.data.datasets[0].data = [...currChart];
  chartDashboard.update();
  timeDashboardUnclick(document.getElementById("month"))
  timeDashboardClick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("year"))
};
function yearClick() {
  currChart = [...chartYear]
  chartDashboard.data.datasets[0].data = [...currChart];
  chartDashboard.update();
  timeDashboardUnclick(document.getElementById("year"))
  timeDashboardClick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("month"))
};



// Change URL 
window.onload = function(){ 
  document.getElementById("dashboard_admin").addEventListener("click", () => {
    changeUrl("Dashboard")
  });
  
  document.getElementById("movieTheatres_admin").addEventListener("click", () => {
    changeUrl("MovieTheatres")
  });
  document.getElementById("movies_admin").addEventListener("click", () => {
    changeUrl("Movies")
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

// Add movie theatre
let btnAddTheatre = document.getElementById('btn_add-theatre');
let theatresList = document.getElementById('list_theatres')

let theatreName = document.getElementById('theatre_name')
let theatreImg = document.getElementById('theatre_img')
let count = 0;

btnAddTheatre.addEventListener('click', () => {
  count++;
  let name = theatreName.value
  let img = theatreImg.value.slice(12)
  console.log(img)
  let template = `
            <tr>
                <th scope="row">${count}</th>
                <td>${name}</td>
                <td><img class="theatres_img" src="/images/Movie Theatres/${img}" alt=""></td>
                <td><label class="theatres_checkbox-outer"><input type="checkbox" id="theatre1"
                            class="theatres_checkbox" name="theatre1" value="${name}"><span
                            class="checkmark"></span></label></td>
                <td>Edit</td>
            </tr>
  `
  theatresList.innerHTML += template
})
