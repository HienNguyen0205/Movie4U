// // Chart Dashboard
// import * as Utils from "./Utils";
// // import { months } from "./Utils";
// const myChart = document.querySelector('#dashboard-chart').getContext('2d')
// const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
// const labels = Utils.months({count: 7});
// const data = {
//     labels: labels,
//     datasets: [
//         {
//           label: 'Dataset 1',
//           data: [12, 19, 3, 5, 2, 3, 1],
//           borderColor: Utils.CHART_COLORS.red,
//           backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//         },
//     ]
//   };

// new Chart(myChart, {
//     type: 'line',
//     data: data,
//     options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//           title: {
//             display: true,
//             text: 'Chart.js Line Chart'
//           }
//         }
//       },
// });


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
      data: [2000, 40000, 55000, 35000, 10000, 14000, 14000, 24000, 34000, 26000, 13000, 44000],
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