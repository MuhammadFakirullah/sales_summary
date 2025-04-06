const lineCanvas = document.getElementById('linechart');

if (lineCanvas) {
    const lineLabels = JSON.parse(lineCanvas.dataset.lineLabels || "[]");
    const lineValues = JSON.parse(lineCanvas.dataset.lineValues || "[]");

    const ctx = lineCanvas.getContext('2d');

    // Create a new line chart with dynamic data
    const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lineLabels, // dynamic labels
            datasets: [{
                label: 'Number of Transaction',
                data: lineValues, // dynamic values
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Number of Transactions: ${context.raw}`;
                        }
                    }
                },
                legend: {
                    display: true
                }
            },
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
                        text: 'Number of transactions',
                        font: {
                            size: 12
                        }
                    },
                    beginAtZero: true
                }
            }
        }
        
    });

    // Calculate total, max, min, avg
    const totalTransactions = lineValues.reduce((sum, value) => sum + value, 0);
    const maxTransactions = Math.max(...lineValues);
    const minTransactions = Math.min(...lineValues);
    const maxMonth = lineLabels[lineValues.indexOf(maxTransactions)];
    const minMonth = lineLabels[lineValues.indexOf(minTransactions)];
    const avgTransactions = (totalTransactions / lineValues.length).toFixed(2);

    // Summary
    const summaryLine = `
    This line chart shows the trend of transactions from <b>${lineLabels[0]}</b> to <b>${lineLabels[lineLabels.length - 1]}</b>.
    The total number of transactions is <b>${totalTransactions}</b> with an average of <b>${avgTransactions}</b> per month.
    The highest transaction count occurred in <b>${maxMonth}</b> with <b>${maxTransactions}</b> transactions,
    while the lowest was in <b>${minMonth}</b> with only <b>${minTransactions}</b> transactions.
    `;

    document.getElementById('linechartSummary').innerHTML = summaryLine;
}
