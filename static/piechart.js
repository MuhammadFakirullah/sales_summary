const pieCanvas = document.getElementById('piechart');

if(pieCanvas){
    const pieLabels = JSON.parse(pieCanvas.dataset.pieLabels || "[]");
    const pieValues = JSON.parse(pieCanvas.dataset.pieValues || "[]");

    const ctx = pieCanvas.getContext('2d');

    // Create a new pie chart
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: pieLabels,
            datasets: [{
                label: 'Number of Sales',
                data: pieValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right', // Position the labels to the right
                    labels: {
                        boxWidth: 20, // Size of the box next to the label
                        padding: 20, // Space between the label and the chart
                        font: {
                            size: 12 // Size of the font
                        }
                    }
                }
            }
        }
    });        

    // Calculate total, max, and min sales
    const totalSalesPie = pieValues.reduce((sum, value) => sum + value, 0);
    const maxSalesPie = Math.max(...pieValues);
    const minSalesPie = Math.min(...pieValues);
    const maxCategoryPie = pieLabels[pieValues.indexOf(maxSalesPie)];
    const minCategoryPie = pieLabels[pieValues.indexOf(minSalesPie)];

    // Create a dynamic summary
    const summaryPie = `
    This pie chart represents sales distribution across five categories.
    The sales for ${pieLabels.join(', ')} are ${pieValues.join(', ')} respectively.
    The highest sales are recorded in <b>${maxCategoryPie}</b> with <b>${maxSalesPie}</b> units,
    while the lowest is in <b>${minCategoryPie}</b> with only <b>${minSalesPie}</b> units.
    The total sales from all categories amount to <b>${totalSalesPie}</b>.
    `;

    document.getElementById('piechartSummary').innerHTML = summaryPie;
}

