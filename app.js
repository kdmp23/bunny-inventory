
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyDpDkjGsPG5Oa1lwaox6PHIKpmIvJ-bRxE",

    authDomain: "bunny-inventory.firebaseapp.com",

    projectId: "bunny-inventory",

    storageBucket: "bunny-inventory.firebasestorage.app",

    messagingSenderId: "1020869773891",

    appId: "1:1020869773891:web:a374dc995cb0adda13a2f6"

};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const app = document.getElementById("app");

// ---------- SESSION ----------

let currentEmployee = "";
let currentRole = "employee"; // employee | manager

let currentLocation = "";

let selectedItem = null;
let selectedAmount = 0;

let previousScreen = "";

let searchText = "";

let activityLog = [];

let currentScreen = "login";

// ---------- LOCATIONS ----------

const LOCATIONS = [
    
    "FOH Fridge",
    "FOH Shelf",
    "FOH",
    "Kitchen Fridge",
    "Shelf",
    "Dry Cambros",
    "Freezer",
    "Miscellaneous"
];

let inventory = [];

async function uploadInventory() {

    for (const item of inventory) {

        console.log(item);

        await setDoc(
            doc(db, "inventory", item.id.toString()),
            item
        );

        console.log("Uploaded", item.name);

    }

    alert("Done");

}

window.uploadInventory = uploadInventory;

function loadInventory() {

    onSnapshot(collection(db, "inventory"), (snapshot) => {

        inventory = [];

        snapshot.forEach(doc => {
            inventory.push(doc.data());
        });

        console.log("Inventory updated!");

        if(currentEmployee === "") return;

switch(currentScreen){

    case "dashboard":
        showDashboard();
        break;

    case "locations":
        showLocations();
        break;

    case "items":
        showItems(currentLocation);
        break;

    case "search":
        showSearch();
        break;

    case "attention":
        showAttention();
        break;

    case "activity":
        showActivity();
        break;

    case "update":
        renderUpdateItem();
        break;

case "update":

    if (selectedItem) {

        selectedItem = inventory.find(
            item => item.id === selectedItem.id
        );

        renderUpdateItem();
    }

    break;

}

    });

}

// ---------- START ----------

showLogin();


// ======================================
// LOGIN
// ======================================

function start() {

    loadInventory();

    showLogin();

}

start();

function showLogin(){

    app.innerHTML = `

    <div class="container">

        <h1>Bunny Bubble Tea</h1>

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

async function login(){

    const code = document
        .getElementById("employeeCode")
        .value
        .trim();

    if(code === ""){

        return;

    }

    const employeeDoc = await getDoc(
        doc(db, "employee", code)
    );

    if(!employeeDoc.exists()){

        alert("Employee not found");

        return;

    }

    const employee = employeeDoc.data();

    currentEmployee = employee.name;

    currentRole = employee.role;

    showDashboard();

}

// ======================================
// DASHBOARD
// ======================================

function showDashboard(){

currentScreen = "dashboard";

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

        <h1>Bunny Bubble Tea</h1>

        <p class="subtitle">

            Welcome, ${currentEmployee}

        </p>

<div
    class="search-bar"
    onclick="showSearch()">

    <span>🔍</span>

    <span>Search Inventory</span>

</div>

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
    
    currentScreen = "activity";

    let html = `

    <div class="container">

        <button
            class="top-back"
            onclick="showDashboard()">

            ← Back

        </button>

        <h1>Activity</h1>

    `;

    if(activityLog.length === 0){

        html += `

    <div class="empty-state">

        <div class="empty-icon">

            📋

        </div>

        <h3>No activity yet</h3>

        <p>

            Inventory updates will appear here.

        </p>

    </div>

`;

    }else{

        activityLog.forEach(entry =>{

            const time = entry.time.toLocaleTimeString([],{
                hour:"numeric",
                minute:"2-digit"
            });

            html += `

                <div class="activity-card">

                    <div class="activity-header">

                        <strong>${entry.employee}</strong>

                        <span>${time}</span>

                    </div>

                    <div class="activity-change">

                        ${entry.change > 0 ? "+" : ""}${entry.change}
                        ${entry.unit}
                        ${entry.item}

                    </div>

                    <div class="activity-location">

                        ${entry.location}

                    </div>

                </div>

            `;

        });

    }
    
    html += `

    </div>

`;

    app.innerHTML = html;

}

function showManager(){

    app.innerHTML = `

    <div class="container">

        <button
            class="top-back"
            onclick="showDashboard()">

            ← Back

        </button>

        <h1>⚙️ Manager</h1>

        <button>

            📦 Manage Inventory

        </button>

        <button>

            👥 Employees

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


function showLocations(){
    
    currentScreen = "locations";

    let html = `

    <div class="container">
    
            <button
            class="top-back"
            onclick="showDashboard()">

            ← Back

        </button>

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

function createItemCard(item, statusColor){

    return `

    <div
        class="item"
        onclick="showUpdateItem(${item.id})">

        <div class="item-header">

            <span class="${statusColor}">●</span>

            <strong>${item.name}</strong>

        </div>

        <div class="item-info">

            ${item.location}

        </div>

        <div class="item-info">

            ${item.quantity} ${item.unit}

        </div>

    </div>

    `;

}

function showItems(location){
    
    currentScreen = "items";
    
    previousScreen = "items";

    currentLocation = location;

    let html = `

    <div class="container">

        <button
            class="top-back"
            onclick="showLocations()">

            ← Back

        </button>

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

html += createItemCard(item, statusClass);

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
    
    currentScreen = "update";

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
            onclick="goBack()">
            
            ← Back

        </button>

    </div>
    
    <div id="toast" class="toast">

    ✓ Inventory Updated

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
    
    currentScreen = "attention";

    previousScreen = "attention";

    const outItems = inventory.filter(item =>
        item.quantity === 0
    );

    const lowItems = inventory.filter(item =>
        item.quantity > 0 &&
        item.quantity <= item.minimum
    );

    let html = `

    <div class="container">

        <button
            class="top-back"
            onclick="showDashboard()">

            ← Back

        </button>

        <h1>Attention Required</h1>

    `;

    // -------------------------
    // OUT OF STOCK
    // -------------------------

    if(outItems.length > 0){

        html += `

        <div class="card">

            <h2>🔴 Out of Stock (${outItems.length})</h2>

        `;

        outItems.forEach(item=>{

    html += createItemCard(item,"red");

});

        html += `</div>`;

    }

    // -------------------------
    // LOW STOCK
    // -------------------------

    if(lowItems.length > 0){

        html += `

        <div class="card">

            <h2>🟡 Low Stock (${lowItems.length})</h2>

        `;

        lowItems.forEach(item=>{

    html += createItemCard(item,"yellow");

});

        html += `</div>`;

    }

    // -------------------------
    // EVERYTHING GOOD
    // -------------------------

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

    // -------------------------
    // BACK BUTTON
    // -------------------------

    html += `

        <button
            class="back"
            onclick="showDashboard()">

            ← Back

        </button>

    </div>

    `;

html += `

    </div>

`;

    app.innerHTML = html;

}

function goBack(){

    switch(previousScreen){

        case "attention":
            showAttention();
            break;

        case "search":
            showSearch();
            break;

        default:
            showItems(currentLocation);

    }

}

function showSearch(){
    
    currentScreen = "search";
    
    previousScreen = "search";

    app.innerHTML = `

    <div class="container">

        <button
            class="top-back"
            onclick="exitSearch()">

            ← Back

        </button>

        <h1>Search</h1>

        <input
            id="searchInput"
            type="text"
            placeholder="Search inventory..."
            value="${searchText}"
            autofocus
            oninput="updateSearch()"
        >

        <div id="searchResults">

        </div>

    </div>

    `;

    updateSearch();

}

function updateSearch(){

    searchText = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    let html = "";

    const results = inventory.filter(item =>

        item.active &&

        (

            item.name.toLowerCase().includes(searchText)

            ||

            item.location.toLowerCase().includes(searchText)

        )

    );

    if(results.length === 0){

        html = `

            <div class="card">

                No items found.

            </div>

        `;

    }else{

        results.forEach(item=>{

            let color = "green";

            if(item.quantity <= 0){

                color = "red";

            }else if(item.quantity <= item.minimum){

                color = "yellow";

            }

            html += createItemCard(item,color);

        });

    }

    document.getElementById("searchResults").innerHTML = html;

}

function exitSearch(){

    searchText = "";

    showDashboard();

}

async function saveInventory(){

    const newStock = Math.max(
        0,
        selectedItem.quantity + selectedAmount
    );

    // Nothing changed
    if(newStock === selectedItem.quantity){

        return;

    }

    // Update inventory
    selectedItem.quantity = newStock;

await updateDoc(
    doc(db, "inventory", selectedItem.id.toString()),
    {
        quantity: newStock
    }
);

    // Save activity
    activityLog.unshift({

        employee: currentEmployee,

        item: selectedItem.name,

        location: selectedItem.location,

        change: selectedAmount,

        quantity: newStock,

        unit: selectedItem.unit,

        time: new Date()

    });

    // Reset adjustment
    selectedAmount = 0;

showToast("✓ Inventory Updated");

    // Go back where the user came from
    goBack();

}

function showToast(message){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    },10);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },1200);

}

window.login = login;

window.showAttention = showAttention;

window.showManager = showManager;

window.showSearch = showSearch;

window.showInventory = showInventory;

window.showDashboard = showDashboard;

window.showItems = showItems;

window.showActivity = showActivity;

window.showUpdateItem = showUpdateItem;

window.showLocations = showLocations;

window.adjustAmount = adjustAmount;

window.resetAdjustment = resetAdjustment;

window.saveInventory = saveInventory;

window.goBack = goBack;

window.exitSearch = exitSearch;

window.loadInventory = loadInventory;

window.uploadInventory = uploadInventory;

window.updateSearch = updateSearch;