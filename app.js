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

let previousScreen = "";

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
    
    let attentionCard = "";

if(currentRole === "manager"){

    const outCount =
        inventory.filter(i => i.quantity === 0).length;

    const lowCount =
        inventory.filter(i =>
            i.quantity > 0 &&
            i.quantity <= i.minimum
        ).length;

    attentionCard = `

        <div
            class="card"
            onclick="showAttention()"
            style="cursor:pointer;">

            <h2>⚠️ Attention Required</h2>

            <p class="item-info">

                ${outCount} Out of Stock

            </p>

            <p class="item-info">

                ${lowCount} Low Stock

            </p>

        </div>

    `;

}

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
        
        ${attentionCard}

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

      <div class="card stock-preview">

    <div class="stock-number">

        ${selectedItem.quantity} ${selectedItem.unit}

    </div>

    <div class="adjustment ${
        selectedAmount > 0
            ? "green"
            : selectedAmount < 0
                ? "red"
                : ""
    }">

        ${
            selectedAmount > 0
                ? "+"
                : ""
        }${selectedAmount} ${selectedItem.unit}

    </div>

    <hr>

    <div class="stock-number ${statusClass}">

        ${newStock} ${selectedItem.unit}

    </div>

</div>
    
     <div class="card">

    <div class="quick-grid">

        <button onclick="adjustAmount(1)">+1</button>

        <button onclick="adjustAmount(3)">+3</button>

        <button onclick="adjustAmount(5)">+5</button>

        <button onclick="adjustAmount(10)">+10</button>

        <div class="divider"></div>

        <button onclick="adjustAmount(-1)">-1</button>

        <button onclick="adjustAmount(-3)">-3</button>

        <button onclick="adjustAmount(-5)">-5</button>

        <button onclick="adjustAmount(-10)">-10</button>

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

function resetAdjustment(){

    selectedAmount = 0;

    renderUpdateItem();

}


function showAttention(){

    const outItems = inventory.filter(item =>
        item.quantity === 0
    );

    const lowItems = inventory.filter(item =>
        item.quantity > 0 &&
        item.quantity <= item.minimum
    );

    let html = `

    <div class="container">

        <h1>Attention Required</h1>

    `;

    if(outItems.length){

        html += `

        <div class="card">

            <h2>🔴 Out of Stock</h2>

        `;

        outItems.forEach(item=>{

            html += `

            <div
                class="item"
                onclick="showUpdateItem(${item.id})">

                ${item.name}

            </div>

            `;

        });

        html += `</div>`;

    }

    if(lowItems.length){

        html += `

        <div class="card">

            <h2>🟡 Low Stock</h2>

        `;

        lowItems.forEach(item=>{

            html += `

            <div
                class="item"
                onclick="showUpdateItem(${item.id})">

                ${item.name}

            </div>

            `;

        });

        html += `</div>`;

    }

    if(outItems.length === 0 && lowItems.length === 0){

        html += `

        <div class="card">

            <h2>✅ Inventory Healthy</h2>

            <p class="item-info">

                No items require attention.

            </p>

        </div>

        `;

    }

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