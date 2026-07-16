// ======================================
// BUNNY INVENTORY v1.0
// ======================================

// ---------- APP ----------

const app = document.getElementById("app");

// ---------- SESSION ----------

let currentEmployee = "";
let currentRole = "employee"; // employee | manager

let currentMode = "";
let currentLocation = "";

let selectedItem = null;
let selectedAmount = 0;

// ---------- LOCATIONS ----------

const LOCATIONS = [
    "Shelf",
    "Dry Cambros",
    "FOH Shelf",
    "FOH",
    "Kitchen Fridge",
    "FOH Fridge",
    "Freezer"
];

// ---------- SAMPLE EMPLOYEES ----------
// Later these come from Firebase

const employees = [

    {
        code:"1234",
        name:"Manager",
        role:"manager"
    },

    {
        code:"1235",
        name:"Employee",
        role:"employee"
    }

];

// ---------- SAMPLE INVENTORY ----------
// Later this comes from Firebase

const inventory = [

    {
        id:1,
        name:"Chicken Breast",
        quantity:42,
        unit:"lb",
        minimum:10,
        location:"Kitchen Fridge",
        active:true
    },

    {
        id:2,
        name:"Mozzarella",
        quantity:6,
        unit:"lb",
        minimum:10,
        location:"Kitchen Fridge",
        active:true
    },

    {
        id:3,
        name:"Heavy Cream",
        quantity:0,
        unit:"qt",
        minimum:2,
        location:"Kitchen Fridge",
        active:true
    },

    {
        id:4,
        name:"French Fries",
        quantity:5,
        unit:"Case",
        minimum:2,
        location:"Freezer",
        active:true
    },

    {
        id:5,
        name:"Canola Oil",
        quantity:8,
        unit:"Gal",
        minimum:2,
        location:"Shelf",
        active:true
    }

];

// ---------- START ----------

showLogin();


// ======================================
// LOGIN
// ======================================

function showLogin(){

    app.innerHTML = `

    <div class="container">

        <h1>🍔 Bunny Inventory</h1>

        <p class="subtitle">

            Employee Code

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

    const code = document
        .getElementById("employeeCode")
        .value
        .trim();

    if(code===""){

        return;

    }

    const employee =
        employees.find(e=>e.code===code);

    if(!employee){

        alert("Employee not found");

        return;

    }

    currentEmployee = employee.name;

    currentRole = employee.role;

    showDashboard();

}

// ======================================
// DASHBOARD
// ======================================

function showDashboard(){

    let managerButtons = "";

    if(currentRole === "manager"){

        managerButtons = `

            <button onclick="showManager()">

                ⚙️ Manager

            </button>

        `;

    }

    app.innerHTML = `

    <div class="container">

        <h1>🍔 Bunny Inventory</h1>

        <p class="subtitle">

            Welcome, ${currentEmployee}

        </p>

        <button onclick="receiveInventory()">

            📥 Receive Inventory

        </button>

        <button onclick="useInventory()">

            📤 Use Inventory

        </button>

        <button onclick="showActivity()">

            📋 Activity

        </button>

        ${managerButtons}

    </div>

    `;

}