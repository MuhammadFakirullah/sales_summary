const horizontalCanvas = document.getElementById('horizontalbarchart');

if(horizontalCanvas){
    const horizontalLabels = JSON.parse(horizontalCanvas.dataset.horizontalLabels || "[]");
    const horizontalValues = JSON.parse(horizontalCanvas.dataset.horizontalValues || "[]");

    const ctx = horizontalCanvas.getContext('2d');

    // Create a new bar chart
    const myHorizontalBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: horizontalLabels,
            datasets: [{
                label: 'Number of payments received',
                data: horizontalValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    // 'rgba(54, 162, 235, 1)',
                    // 'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of payment',
                        font: {
                            size: 12
                        }
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Payment type',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    // Calculate total, max, and min values
    const totalPayments = horizontalValues.reduce((sum, value) => sum + value, 0);
    const maxPayment = Math.max(...horizontalValues);
    const minPayment = Math.min(...horizontalValues);
    const maxLabel = horizontalLabels[horizontalValues.indexOf(maxPayment)];
    const minLabel = horizontalLabels[horizontalValues.indexOf(minPayment)];

    // Build the summary
    const summaryBar = `
    This bar chart illustrates the distribution of payments received via different methods.
    The payment counts for ${horizontalLabels.join(', ')} are ${horizontalValues.join(', ')} respectively.
    The highest number of payments was through <b>${maxLabel}</b> with <b>${maxPayment}</b> transactions,
    while the lowest was through <b>${minLabel}</b> with only <b>${minPayment}</b> transactions.
    The total number of payments recorded is <b>${totalPayments}</b>.
    `;

    // Insert the summary into a placeholder element
    document.getElementById('horizontalBarChartSummary').innerHTML = summaryBar;


}