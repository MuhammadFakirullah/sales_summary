// Initialize Flatpickr on both input fields for date range selection
flatpickr("#startDate", {
    dateFormat: "d/m/Y", // Format for the date (dd/mm/yyyy)
    allowInput: true, // Allow typing directly into the input field
});

flatpickr("#endDate", {
    dateFormat: "d/m/Y", // Format for the date (dd/mm/yyyy)
    allowInput: true, // Allow typing directly into the input field
});

// Handle form submission
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the start and end dates
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // For demonstration, just log the selected dates
    console.log("Selected Date Range:", startDate, "to", endDate);

    // You can add further logic here to filter data based on the selected dates
});