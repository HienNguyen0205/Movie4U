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

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [20, 40, 60, 70, 80, 100],
        colorText: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#9D8CEF",
        backgroundColor: "#485296"
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
            y: { 
              min: 0,
              max: 100
            }
          }
    }
  });