const doughnutCanvas = document.getElementById('doughnutchart');

if (doughnutCanvas) {
    const doughnutLabels = JSON.parse(doughnutCanvas.dataset.doughnutLabels || "[]");
    const doughnutValues = JSON.parse(doughnutCanvas.dataset.doughnutValues || "[]");

    const ctx = doughnutCanvas.getContext('2d');

    const myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: doughnutLabels,
            datasets: [{
                label: 'Number of Sales',
                data: doughnutValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                    'rgba(255, 205, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 20,
                        padding: 20,
                        font: { size: 12 }
                    }
                }
            }
        }
    });

    // Summary
    const totalSales = doughnutValues.reduce((sum, value) => sum + value, 0);
    const maxSales = Math.max(...doughnutValues);
    const minSales = Math.min(...doughnutValues);
    const maxProduct = doughnutLabels[doughnutValues.indexOf(maxSales)];
    const minProduct = doughnutLabels[doughnutValues.indexOf(minSales)];

    const summary = `
    The graph shows the top products of sales that were recorded.<br>
    The sales for ${doughnutLabels.join(', ')} are ${doughnutValues.join(', ')} respectively.<br>
    The product with the highest sales record is <b>${maxProduct}</b> while the lowest is <b>${minProduct}</b>.
    The total number of sales for all products is <b>${totalSales}</b>.
    `;

    document.getElementById('doughnutSummary').innerHTML = summary;
}
