const stackCanvas = document.getElementById('stackedBarChart');

if (stackCanvas) {
    const stackLabels = JSON.parse(stackCanvas.dataset.stackLabels);
    const stackCategories = JSON.parse(stackCanvas.dataset.stackCategories);
    const stackValues = JSON.parse(stackCanvas.dataset.stackValues);

    const ctx = stackCanvas.getContext('2d');

    // Create a dataset for each category
    const datasets = stackValues.map((categoryValues, index) => {
        return {
            label: stackCategories[index],  // Use category name as label
            data: categoryValues,
            backgroundColor: `rgba(${(index * 60) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`,
        };
    });

    const myStackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stackLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Months'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Profit (RM)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });

    // Calculate summary for chart
    const totalProfit = stackValues.flat().reduce((sum, val) => sum + val, 0);
    const maxProfit = Math.max(...stackValues.flat());
    const minProfit = Math.min(...stackValues.flat());
    const maxMonth = stackLabels[stackValues.flat().indexOf(maxProfit)];
    const minMonth = stackLabels[stackValues.flat().indexOf(minProfit)];
    
    const stackedChartSummary = `
        The graph shows the Profit performance from <b>${stackLabels[0]}</b> to <b>${stackLabels[stackLabels.length - 1]}</b>.
        The highest profit was in <b>${maxMonth}</b> with RM${maxProfit.toLocaleString()}, 
        while the lowest was in <b>${minMonth}</b> with RM${minProfit.toLocaleString()}.
        The total sales for this period is <b>RM${totalProfit.toLocaleString()}</b>.
    `;

    // Inject summary into HTML element
    document.getElementById('stackedBarChartSummary').innerHTML = stackedChartSummary;
}
