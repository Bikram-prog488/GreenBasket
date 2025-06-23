// ✅ Your updated JavaScript code with admin panel + dark mode support

// --- Back to Top Button ---
let backToTopBtn = document.querySelector('.back-to-top');
window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
};

// --- Top Nav Menu Active Item Toggle ---
let menuItems = document.getElementsByClassName('menu-item');
Array.from(menuItems).forEach((item) => {
    item.onclick = () => {
        let currMenu = document.querySelector('.menu-item.active');
        if (currMenu) currMenu.classList.remove('active');
        item.classList.add('active');
    };
});

// --- Food Category Filter ---
let foodMenuList = document.querySelector('.food-item-wrap');
let foodCategory = document.querySelector('.food-category');
let categories = foodCategory.querySelectorAll('button');
Array.from(categories).forEach((item) => {
    item.onclick = (e) => {
        let currCat = foodCategory.querySelector('button.active');
        if (currCat) currCat.classList.remove('active');
        e.target.classList.add('active');
        foodMenuList.className = 'food-item-wrap ' + e.target.getAttribute('data-food-type');
    };
});

// --- On Scroll Animation ---
let scroll = window.requestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
let elToShow = document.querySelectorAll('.play-on-scroll');
function isElInViewPort(el) {
    let rect = el.getBoundingClientRect();
    return (
        (rect.top <= 0 && rect.bottom >= 0) ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
}
function loop() {
    elToShow.forEach((item) => {
        if (isElInViewPort(item)) {
            item.classList.add('start');
        } else {
            item.classList.remove('start');
        }
    });
    scroll(loop);
}
loop();

// --- Mobile Nav Active Item and Bottom Move Indicator ---
let bottomNavItems = document.querySelectorAll('.mb-nav-item');
let bottomMove = document.querySelector('.mb-move-item');
bottomNavItems.forEach((item, index) => {
    item.onclick = () => {
        let crrItem = document.querySelector('.mb-nav-item.active');
        if (crrItem) crrItem.classList.remove('active');
        item.classList.add('active');
        bottomMove.style.left = index * 25 + '%';
    };
});

// --- DOM Ready Event ---
document.addEventListener("DOMContentLoaded", function () {
    console.log("Main page loaded.");

    // --- Dark Mode Toggle ---
    const darkToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Load saved theme on page load
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        if (darkToggle) darkToggle.checked = true;
    }

    if (darkToggle) {
        darkToggle.addEventListener('change', () => {
            if (darkToggle.checked) {
                body.classList.add("dark-mode");
                localStorage.setItem("theme", "dark");
            } else {
                body.classList.remove("dark-mode");
                localStorage.setItem("theme", "light");
            }
        });
    }

    // --- Auth Section ---
    const authSection = document.getElementById("auth-section");
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        authSection.innerHTML = `
            <div class="user-menu">
                <i class="bx bx-user-circle user-icon"></i>
                <div class="dropdown">
                    <p>Welcome, ${loggedInUser}</p>
                    <button id="logout">Logout</button>
                    <button id="viewOrders">Order History</button>
                </div>
            </div>
        `;
        document.querySelector(".user-icon").addEventListener("click", () => {
            document.querySelector(".dropdown").classList.toggle("active");
        });
        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            location.reload();
        });
        document.getElementById("viewOrders").addEventListener("click", () => {
            window.location.href = "order-history.html";
        });
    } else {
        authSection.innerHTML = `<a href="login-signup.html" class="login-btn">Login / Signup</a>`;
    }

    // --- Cart System ---
    const cartIcon = document.getElementById('cart-icon');
    const cartCountElem = document.getElementById('cart-count');
    const cart = document.getElementById('cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');
    let cartItems = [];

    cartIcon.addEventListener('click', () => {
        cart.style.display = (cart.style.display === 'block') ? 'none' : 'block';
    });

    function updateCartCount() {
        const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElem.textContent = totalQty;
        cartCountElem.style.display = totalQty > 0 ? 'inline-block' : 'none';
    }

    function renderCart() {
        cartItemsList.innerHTML = '';
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
            const li = document.createElement('li');
            li.textContent = `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.marginLeft = '10px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            li.appendChild(removeBtn);
            cartItemsList.appendChild(li);
        });
        cartTotalElem.textContent = total.toFixed(2);
        updateCartCount();
        cart.style.display = cartItems.length ? 'block' : 'none';
    }

    function removeFromCart(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        renderCart();
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const existing = cartItems.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cartItems.push({ id, name, price, quantity: 1 });
            }
            renderCart();
        });
    });

    // --- Checkout Flow ---
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('paymentModal');
    const selectedMethodInput = document.getElementById("selectedMethod");

    checkoutBtn.addEventListener('click', () => {
        if (!cartItems.length) return alert("Your cart is empty!");
        paymentModal.style.display = 'flex';
    });

    window.closeModal = () => paymentModal.style.display = 'none';

    window.selectPaymentMethod = (method) => {
        selectedMethodInput.value = method;
        document.querySelectorAll(".payment-btn").forEach(btn => btn.classList.remove("selected"));
        document.querySelector(`.payment-btn.${method}`)?.classList.add("selected");
        document.querySelectorAll('.payment-detail').forEach(section => section.style.display = 'none');
        const methodDetails = {
            card: '#cardDetails',
            upi: '#upiDetails',
            netbanking: '#netBankingDetails',
            cod: '#codDetails'
        };
        document.querySelector(methodDetails[method])?.style.setProperty('display', 'flex');
    };

    window.placeOrder = () => {
    const method = selectedMethodInput.value;
    if (!method) return alert("Please select a payment method.");

    const fullName = document.getElementById("fullName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const fullAddress = document.getElementById("fullAddress").value.trim();

    if (!fullName || !phoneNumber || !pincode || !fullAddress) {
        return alert("Please fill out all delivery details.");
    }

    const smsMessageElem = document.getElementById('smsMessage');
    let message = `Thank you for your order!\n\nOrder Summary:\n`;
    let total = 0;
    const orderItems = [];

    cartItems.forEach(item => {
        message += `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
        orderItems.push(item);
    });

    message += `\nTotal: ₹${total.toFixed(2)}\nPayment Method: ${method.toUpperCase()}`;
    message += `\n\nDelivery Details:\nName: ${fullName}\nPhone: ${phoneNumber}\nPincode: ${pincode}\nAddress: ${fullAddress}`;
    smsMessageElem.textContent = message;

    const deliveryInfo = { fullName, phoneNumber, pincode, fullAddress };

    // --- Save to orderHistory (user view) ---
    const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    history.push({
        date: new Date().toLocaleString(),
        items: orderItems,
        total: total.toFixed(2),
        method: method.toUpperCase(),
        status: "Pending",
        delivery: deliveryInfo
    });
    localStorage.setItem("orderHistory", JSON.stringify(history));

    // --- Save to orders (admin view) ---
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push({
        customer: fullName,
        items: orderItems,
        total: total.toFixed(2),
        date: new Date().toLocaleString(),
        method: method.toUpperCase(),
        status: "Pending",
        delivery: deliveryInfo
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    cartItems = [];
    renderCart();
    cart.style.display = 'none';
    paymentModal.style.display = 'none';
    document.getElementById('smsModal').style.display = 'flex';

    setTimeout(() => {
        document.getElementById('smsModal').style.display = 'none';
    }, 15000);
};

});
