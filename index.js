var db = window.openDatabase("Thai_restaurant", "1.0", "Thai Market", 200000);

window.onload = on_load;

function on_load() {
    initialize_database();
    fetch_database();
    get_product();

    var account_id = localStorage.getItem("account_id");
    if (account_id != "") {
        login_success();
    }
    else {
        logout();
    }
}

function get_product() {
    db.transaction(function (tx) {
        var query = `SELECT p.name, p.price, p.id, c.name AS category_name FROM product p, category c
        WHERE p.category_id = c.id`;

        tx.executeSql(
            query,
            [],
            function (tx, result) {
                log(`INFO`, "Get a list of products successfully.");
                show_product(result.rows);
            },
            transaction_error);
    });
}

function show_product(products) {
    var product_list = document.getElementById("product-list");

    for (var product of products) {
        product_list.innerHTML += `<div class="col-6 col-sm-4 col-lg-3 mt-3 p-3 product">
                                   <div class="product-img">
                                     <img src="image/comsuon.jpg" alt="Product ${product.id}">
                                   </div>
                                   
                                   <div class="product-name">${product.name}</div>
                                   <div class="product-category">${product.category_name}</div>
                                   <div class="product-price">${product.price} VNĐ</div>
    
                                   <div class="text-end">
                                     <button id="${product.id}" class="btn btn-success btn-sm">Add to Cart</button>
                                   </div>
                                 </div>`;
    }
}



document.getElementById("frm-login").onsubmit = login;

function login(e) {

    e.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    db.transaction(function (tx) {
        var query = `SELECT * FROM account WHERE username = ? AND password = ?`;

        tx.executeSql(query, [username, password], function (tx, result) {
            if (result.rows[0]) {
                $("#frm-login").modal("hide");

                localStorage.setItem("account_id", result.rows[0].id);
                localStorage.setItem("account_username", result.rows[0].username);

                login_success();
            }
            else {
                logout();
                alert("Login failed.");
            }
        }, transaction_error);
    });
}

function login_success() {

    var username = localStorage.getItem("account_username");
    document.getElementById("account-info").innerHTML = `
    <button class="btn ms-3 text-light disabled">Hello ${username}!</button>
    <button onclick="logout()" id="btn-logout" class="btn btn-outline-light ms-3">Logout</button>`;
}

function logout() {
    localStorage.setItem("account_id", "");
    localStorage.setItem("account_username", "");

    document.getElementById("account-info").innerHTML = `
    <button id="btn-login" class="btn btn-outline-light ms-3" data-bs-toggle="modal"data-bs-target="#frm-login">Login</button>`;
}
