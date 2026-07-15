const app = document.getElementById("app");

// =========================
// APP STATE
// =========================

let currentEmployee = "";
let currentMode = "";
let currentLocation = "";

// =========================
// LOCATIONS
// =========================

const LOCATIONS = [
    "Shelf",
    "Dry Cambros",
    "FOH Shelf",
    "FOH",
    "Kitchen Fridge",
    "FOH Fridge",
    "Freezer"
];

// =========================
// SAMPLE INVENTORY
// (Later this comes from Firebase)
// =========================

const inventory = [

    {
        id:1,
        name:"Chicken Breast",
        quantity:42,
        unit:"lb",
        minimum:10,
        location:"Kitchen Fridge"
    },

    {
        id:2,
        name:"Mozzarella",
        quantity:6,
        unit:"lb",
        minimum:10,
        location:"Kitchen Fridge"
    },

    {
        id:3,
        name:"Heavy Cream",
        quantity:0,
        unit:"qt",
        minimum:2,
        location:"Kitchen Fridge"
    },

    {
        id:4,
        name:"French Fries",
        quantity:5,
        unit:"Case",
        minimum:2,
        location:"Freezer"
    },

    {
        id:5,
        name:"Canola Oil",
        quantity:8,
        unit:"Gal",
        minimum:2,
        location:"Shelf"
    }

];

// =========================
// START
// =========================

showLogin();

// =========================
// LOGIN
// =========================

function showLogin(){

    app.innerHTML=`

    <div class="container">

        <h1>🍔 Bunny Inventory</h1>

        <p class="subtitle">
            Enter Employee Code
        </p>

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

function login(){

    const code=document
        .getElementById("employeeCode")
        .value
        .trim();

    if(code===""){
        return;
    }

    currentEmployee=code;

    showDashboard();

}

// =========================
// DASHBOARD
// =========================

function showDashboard(){

    app.innerHTML=`

    <div class="container">

        <h1>🍔 Bunny Inventory</h1>

        <p class="subtitle">
            Employee ${currentEmployee}
        </p>

        <button
            class="dashboard-button"
            onclick="receiveInventory()">

            📥 Receive Inventory

        </button>

        <button
            class="dashboard-button"
            onclick="useInventory()">

            📤 Use Inventory

        </button>

        <button
            class="dashboard-button"
            onclick="showActivity()">

            📋 Activity

        </button>

    </div>

    `;

}

function receiveInventory(){

    currentMode="receive";

    showLocations();

}

function useInventory(){

    currentMode="use";

    showLocations();

}

// =========================
// PLACEHOLDERS
// =========================

function showLocations(){

    app.innerHTML=`

    <div class="container">

        <h2>Locations</h2>

        <p class="subtitle">
            Coming Next
        </p>

    </div>

    `;

}

function showActivity(){

    app.innerHTML=`

    <div class="container">

        <h2>Activity</h2>

        <p class="subtitle">
            Coming Soon
        </p>

        <button
            class="back"
            onclick="showDashboard()">

            Back

        </button>

    </div>

    `;

}