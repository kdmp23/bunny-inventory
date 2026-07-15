const app = document.getElementById("app");

// =========================
// APP STATE
// =========================

let currentEmployee = "";
let currentMode = "";
let currentLocation = "";
let selectedAmount = 1;

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

    let html = `
    
    <div class="container">

        <h2>${
            currentMode === "receive"
                ? "📥 Receive Inventory"
                : "📤 Use Inventory"
        }</h2>

        <p class="subtitle">
            Select a Location
        </p>

    `;

    LOCATIONS.forEach(location => {

        const count = inventory.filter(item =>
            item.location === location
        ).length;

        let icon = "📦";

        switch(location){

            case "Shelf":
                icon = "📦";
                break;

            case "Dry Cambros":
                icon = "🟫";
                break;

            case "FOH Shelf":
                icon = "🍽️";
                break;

            case "FOH":
                icon = "🍴";
                break;

            case "Kitchen Fridge":
                icon = "🧊";
                break;

            case "FOH Fridge":
                icon = "🥤";
                break;

            case "Freezer":
                icon = "❄️";
                break;

        }

        html += `

            <div
                class="card"
                onclick="showItems('${location}')"
                style="cursor:pointer; margin-bottom:15px;">

                <h3>${icon} ${location}</h3>

                <p class="item-info">
                    ${count} Item${count !== 1 ? "s" : ""}
                </p>

            </div>

        `;

    });

    html += `

        <button class="back"
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

        <h2>${location}</h2>

        <p class="subtitle">
            Select an Item
        </p>

    `;

    inventory
        .filter(item => item.location === location)
        .forEach(item => {

            let status = "🟢";

            if(item.quantity <= 0){

                status = "🔴";

            }else if(item.quantity <= item.minimum){

                status = "🟡";

            }

            html += `

                <div
                    class="item"
                    onclick="showUpdateItem(${item.id})">

                    <div class="item-title">

                        ${status} ${item.name}

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

function showUpdateItem(id){

    const item = inventory.find(i => i.id === id);

    selectedAmount = 1;

    renderUpdateItem(item);

}

function renderUpdateItem(item){

    app.innerHTML = `

    <div class="container">

        <h2>${item.name}</h2>

        <p class="subtitle">
            ${item.location}
        </p>

        <div class="card">

            <h3>Current Stock</h3>

            <h1>${item.quantity} ${item.unit}</h1>

        </div>

        <div class="card">

            <h3>${
                currentMode === "receive"
                ? "Add"
                : "Use"
            }</h3>

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-top:20px;
            ">

                <button
                    style="width:70px"
                    onclick="changeAmount(-1, ${item.id})">

                    -

                </button>

                <h2>${selectedAmount}</h2>

                <button
                    style="width:70px"
                    onclick="changeAmount(1, ${item.id})">

                    +

                </button>

            </div>

        </div>

        <button onclick="saveInventory(${item.id})">

            Save

        </button>

        <button
            class="back"
            onclick="showItems('${item.location}')">

            ← Back

        </button>

    </div>

    `;

}

function changeAmount(change,id){

    selectedAmount += change;

    if(selectedAmount < 1){

        selectedAmount = 1;

    }

    const item = inventory.find(i=>i.id===id);

    renderUpdateItem(item);

}

function saveInventory(id){

    const item = inventory.find(i=>i.id===id);

    if(currentMode==="receive"){

        item.quantity += selectedAmount;

    }else{

        item.quantity -= selectedAmount;

        if(item.quantity < 0){

            item.quantity = 0;

        }

    }

    showItems(item.location);

}
