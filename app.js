const app = document.getElementById("app");

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

    const code = document.getElementById("employeeCode").value;

    if(code === ""){
        alert("Enter Employee Code");
        return;
    }

    // Temporary login
    showDashboard(code);
}

function showDashboard(employee){

    app.innerHTML = `

        <div class="container">

            <h2>Welcome</h2>

            <p>${employee}</p>

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
    alert("Coming Soon");
}

function useInventory(){
    alert("Coming Soon");
}

function activity(){
    alert("Coming Soon");
}