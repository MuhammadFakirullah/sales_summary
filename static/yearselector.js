
// Populate year dropdown dynamically (e.g., current year to 5 years back)
const yearSelect = document.getElementById("yearSelect");
const currentYear = new Date().getFullYear();
const numberOfYears = 5; // Change this if you want more/less

for (let i = 0; i < numberOfYears; i++) {
    const year = currentYear - i;
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
}
