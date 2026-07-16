// ======================================
// BUNNY INVENTORY v1.0
// ======================================

// ---------- APP ----------

const app = document.getElementById("app");

// ---------- SESSION ----------

let currentEmployee = "";
let currentRole = "employee"; // employee | manager

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

<button onclick="showInventory()">

    📦 Inventory

</button>

        <button onclick="showActivity()">

            📋 Activity

        </button>

        ${managerButtons}

    </div>

    `;

}

function showInventory(){

    showLocations();

}

function showActivity(){

    app.innerHTML = `

    <div class="container">

        <h1>📋 Activity</h1>

        <p class="subtitle">

            Coming Soon

        </p>

        <button
            class="back"
            onclick="showDashboard()">

            ← Back

        </button>

    </div>

    `;

}

function showManager(){

    app.innerHTML = `

    <div class="container">

        <h1>⚙️ Manager</h1>

        <button>

            📦 Manage Inventory

        </button>

        <button>

            👥 Employees

        </button>

        <button>

            📊 Reports

        </button>

        <button
            class="back"
            onclick="showDashboard()">

            ← Back

        </button>

    </div>

    `;

}

// ======================================
// LOCATIONS
// ======================================

function receiveInventory(){

    currentMode = "receive";

    showLocations();

}

function useInventory(){

    currentMode = "use";

    showLocations();

}

function showLocations(){

    let html = `

    <div class="container">

       <h1>

    Inventory

</h1>

        <p class="subtitle">

            Select a Location

        </p>

    `;

    LOCATIONS.forEach(location=>{

        const count =
            inventory.filter(item=>

                item.location===location &&
                item.active

            ).length;

        html += `

        <div
            class="card location-card"
            onclick="showItems('${location}')">

            <h2>

                ${location}

            </h2>

            <p class="item-info">

                ${count} Item${count!==1?"s":""}

            </p>

        </div>

        `;

    });

    html += `

        <button
            class="back"
            onclick="showDashboard()">

            ← Back

        </button>

    </div>

    `;

    app.innerHTML = html;

}

function showItems(location){

    currentLocation = location;

    let html = `

    <div class="container">

        <h1>

            ${location}

        </h1>

        <p class="subtitle">

            Select an Item

        </p>

    `;

    inventory
        .filter(item =>
            item.location === location &&
            item.active
        )
        .forEach(item => {

            let statusClass = "green";

            if(item.quantity <= 0){

                statusClass = "red";

            }else if(item.quantity <= item.minimum){

                statusClass = "yellow";

            }

            html += `

            <div
                class="card item-card"
                onclick="showUpdateItem(${item.id})">

                <div class="item-header">

                    <span class="${statusClass}">●</span>

                    <strong>${item.name}</strong>

                </div>

                <div class="item-info">

                    ${item.quantity} ${item.unit}

                </div>

            </div>

            `;

        });

    html += `

        <button
            class="back"
            onclick="showLocations()">

            ← Back

        </button>

    </div>

    `;

    app.innerHTML = html;

}


function showUpdateItem(id){

    selectedItem = inventory.find(item => item.id === id);

    selectedAmount = 0;

    renderUpdateItem();

}

function renderUpdateItem(){

    const newStock =
        Math.max(
            0,
            selectedItem.quantity + selectedAmount
        );

    let statusClass = "green";

    if(newStock <= 0){

        statusClass = "red";

    }else if(newStock <= selectedItem.minimum){

        statusClass = "yellow";

    }

    app.innerHTML = `

    <div class="container">

        <h1>${selectedItem.name}</h1>

        <p class="subtitle">

            ${selectedItem.location}

        </p>

        <div class="card">

            <h3>Current Stock</h3>

            <h1>

                ${selectedItem.quantity}
                ${selectedItem.unit}

            </h1>

        </div>

        <div class="card">

            <h3>Adjustment</h3>

            <h1>

                ${
                    selectedAmount>0
                    ? "+"
                    : ""
                }${selectedAmount}

                ${selectedItem.unit}

            </h1>

        </div>

        <div class="card">

            <h3>New Stock</h3>

            <h1 class="${statusClass}">

                ${newStock}
                ${selectedItem.unit}

            </h1>

        </div>

        <div class="card">

            <h3>Increase</h3>

            <div class="quick-grid">

                <button onclick="adjustAmount(1)">+1</button>

                <button onclick="adjustAmount(5)">+5</button>

                <button onclick="adjustAmount(10)">+10</button>

                <button onclick="adjustAmount(25)">+25</button>

            </div>

            <h3 style="margin-top:20px">

                Decrease

            </h3>

            <div class="quick-grid">

                <button onclick="adjustAmount(-1)">-1</button>

                <button onclick="adjustAmount(-5)">-5</button>

                <button onclick="adjustAmount(-10)">-10</button>

                <button onclick="adjustAmount(-25)">-25</button>

            </div>

        </div>

<button
    class="back"
    onclick="resetAdjustment()">

    Reset

</button>

        <button onclick="saveInventory()">

            Save

        </button>

        <button
            class="back"
            onclick="showItems(currentLocation)">

            ← Back

        </button>

    </div>

    `;

}

function adjustAmount(amount){

    selectedAmount += amount;

    renderUpdateItem();

}

