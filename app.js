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

const INVENTORY = [
    {
        name: "Chicken Breast",
        qty: 42,
        unit: "lb",
        location: "Kitchen Fridge",
        minimum: 10
    },
    {
        name: "Mozzarella",
        qty: 6,
        unit: "lb",
        location: "Kitchen Fridge",
        minimum: 10
    },
    {
        name: "Heavy Cream",
        qty: 0,
        unit: "qt",
        location: "Kitchen Fridge",
        minimum: 2
    },
    {
        name: "French Fries",
        qty: 4,
        unit: "Cases",
        location: "Freezer",
        minimum: 2
    },
    {
        name: "Canola Oil",
        qty: 7,
        unit: "Gallons",
        location: "Shelf",
        minimum: 2
    }
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

function login(){

    const code = document.getElementById("employeeCode").value.trim();

    if(code===""){
        alert("Enter Employee Code");
        return;
    }

    currentEmployee = code;

    showDashboard();

}

function showDashboard(){

    app.innerHTML=`

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

function receiveInventory(){

    inventoryMode="Receive Inventory";

    showLocations();

}

function useInventory(){

    inventoryMode="Use Inventory";

    showLocations();

}

function showLocations(){

    let buttons="";

    LOCATIONS.forEach(location=>{

        buttons+=`
        <button onclick="openLocation('${location}')">
            ${location}
        </button>
        `;

    });

    app.innerHTML=`

    <div class="container">

        <h2>${inventoryMode}</h2>

        ${buttons}

        <button onclick="showDashboard()">
            ← Back
        </button>

    </div>

    `;

}

function openLocation(location){

    let html=`

    <div class="container">

    <h2>${location}</h2>

    `;

    INVENTORY
    .filter(item=>item.location===location)
    .forEach(item=>{

        let color="🟢";

        if(item.qty<=0){

            color="🔴";

        }else if(item.qty<=item.minimum){

            color="🟡";

        }

        html+=`

        <button onclick="updateItem('${item.name}')">

            ${color} ${item.name}<br>

            ${item.qty} ${item.unit}

        </button>

        `;

    });

    html+=`

    <button onclick="showLocations()">

        ← Back

    </button>

    </div>

    `;

    app.innerHTML=html;

}

function updateItem(item){

    alert(item+" screen coming next!");

}

function activity(){

    alert("Activity coming soon!");

}