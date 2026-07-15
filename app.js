const app = document.getElementById("app");

let currentEmployee = "";
let inventoryMode = "";

const LOCATIONS = [
    "Shelf",
    "Dry Cambros",
    "FOH Shelf",
    "FOH",
    "Kitchen Fridge",
    "FOH Fridge",
    "Freezer"
];

showLogin();

function showLogin() {
    app.innerHTML = `
        <div class="container">

            <h1>🍔 Kitchen Inventory</h1>

            <input
                id="employeeCode"
                type="password"
                placeholder="Employee Code"
            >

            <button onclick="login()">
                Login
            </button>

        </div>
    `;
}

function login() {

    const code = document.getElementById("employeeCode").value.trim();

    if (code === "") {
        alert("Enter Employee Code");
        return;
    }

    currentEmployee = code;

    showDashboard();
}

function showDashboard() {

    app.innerHTML = `
        <div class="container">

            <h2>Welcome</h2>

            <p>${currentEmployee}</p>

            <button onclick="receiveInventory()">
                📥 Receive Inventory
            </button>

            <button onclick="useInventory()">
                📤 Use Inventory
            </button>

            <button onclick="activity()">
                📋 Activity
            </button>

        </div>
    `;
}

function receiveInventory() {
    inventoryMode = "Receive Inventory";
    showLocations();
}

function useInventory() {
    inventoryMode = "Use Inventory";
    showLocations();
}

function showLocations() {

    let buttons = "";

    LOCATIONS.forEach(location => {
        buttons += `
            <button onclick="openLocation('${location}')">
                ${location}
            </button>
        `;
    });

    app.innerHTML = `
        <div class="container">

            <h2>${inventoryMode}</h2>

            ${buttons}

            <button onclick="showDashboard()">
                ← Back
            </button>

        </div>
    `;
}

function openLocation(location) {
    alert(location + " page coming next!");
}

function activity() {
    alert("Activity page coming soon!");
}