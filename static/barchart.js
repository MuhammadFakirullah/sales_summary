// static/barchart.js

const canvas = document.getElementById('barchart');
const chartLabels = JSON.parse(canvas.dataset.labels);
const chartData = JSON.parse(canvas.dataset.values);

const ctx = document.getElementById('barchart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartLabels,
    datasets: [{
      label: 'Monthly Sales',
      data: chartData,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  },
  options: {
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Months',
                font: {
                    size: 12
                }
            },
            beginAtZero: true
        },
        y: {
            title: {
                display: true,
                text: 'Sales',
                font: {
                    size: 12
                }
            },
            beginAtZero: true
        }
    }
  }
});

// Summary
const totalSales = chartData.reduce((sum, val) => sum + val, 0);
const maxSales = Math.max(...chartData);
const minSales = Math.min(...chartData);
const maxMonth = chartLabels[chartData.indexOf(maxSales)];
const minMonth = chartLabels[chartData.indexOf(minSales)];

const summary = `
  The graph shows the Sales performance from <b>${chartLabels[0]}</b> to <b>${chartLabels[chartLabels.length - 1]}</b>.
  The highest sales was in <b>${maxMonth}</b> with RM${maxSales.toLocaleString()}, 
  while the lowest was in <b>${minMonth}</b> with RM${minSales.toLocaleString()}.
  The total sales for this period is <b>RM${totalSales.toLocaleString()}</b>.
`;

document.getElementById("barchartSummary").innerHTML = summary;
