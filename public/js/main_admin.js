// // Chart Dashboard

const ctx = document.getElementById('dashboard-chart');
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
new Chart(ctx, {
  type: 'line',
  data: {
    labels: MONTHS,
    datasets: [{
      label: null,
      data: [20000, 40000, 55000, 35000, 10000, 14000, 14000, 24000, 34000, 26000, 13000, 44000],
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
              // This more specific font property overrides the global property
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

document.getElementById("today").onclick = function() {
  timeDashboardUnclick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("month"))
  timeDashboardClick(document.getElementById("year"))
};
document.getElementById("week").onclick = function() {
  timeDashboardUnclick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("month"))
  timeDashboardClick(document.getElementById("year"))
};
document.getElementById("month").onclick = function() {
  timeDashboardUnclick(document.getElementById("month"))
  timeDashboardClick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("year"))
};
document.getElementById("year").onclick = function() {
  timeDashboardUnclick(document.getElementById("year"))
  timeDashboardClick(document.getElementById("week"))
  timeDashboardClick(document.getElementById("today"))
  timeDashboardClick(document.getElementById("month"))
};