// ============================================================
//  DATA — Real product images from Unsplash (expanded to 8)
// ============================================================
const products = [
  {
    id: 1,
    name: "Ember Jacket",
    category: "Мода",
    // category: "Fashion",
    price: 129,
    oldPrice: 189,
    rating: 4.9,
    reviews: 142,
    image: "./images/SantaCruz-EmberJacket.jpg",
    badge: "Bestseller",
    badgeType: "sale",
  },
  {
    id: 2,
    name: "Ignite Watch",
    category: "Электроника",
    // category: "Electronics",
    price: 249,
    oldPrice: null,
    rating: 4.8,
    reviews: 98,
    image: "./images/IgniteWatch.jpg",
    badge: "New",
    badgeType: "new",
  },
  {
    id: 3,
    name: "Blaze Backpack",
    category: "Мода",
    // category: "Fashion",
    price: 89,
    oldPrice: 119,
    rating: 4.7,
    reviews: 213,
    image: "./images/BlazeBackpack.jpg",
    badge: "Sale",
    badgeType: "sale",
  },
  {
    id: 4,
    name: "Zen Sound Pro",
    // category: "Electronics",
    category: "Электроника",
    price: 199,
    oldPrice: null,
    rating: 4.9,
    reviews: 76,
    image: "./images/ZenHybridPro.jpg",
    badge: "Top Rated",
    badgeType: "new",
  },
  {
    id: 5,
    name: "Aura Candle Set",
    category: "Дом и быт",
    // category: "Home & Living",
    price: 45,
    oldPrice: 59,
    rating: 4.6,
    reviews: 184,
    image: "./images/AuraCandleSet.jpg",
    badge: "Sale",
    badgeType: "sale",
  },
  {
    id: 6,
    name: "Vita Skincare Kit",
    category: "Красота",
    // category: "Beauty",
    price: 78,
    oldPrice: null,
    rating: 4.9,
    reviews: 231,
    image: "./images/VitaSkincareKit.jpg",
    badge: "Eco",
    badgeType: "new",
  },
  {
    id: 7,
    name: "Nova Sneakers",
    category: "Мода",
    // category: "Fashion",
    price: 159,
    oldPrice: 199,
    rating: 4.7,
    reviews: 167,
    image: "./images/NovaSneakers.jpg",
    badge: "Sale",
    badgeType: "sale",
  },
  {
    id: 8,
    name: "Lumina Desk Lamp",
    category: "Дом и быт",
    // category: "Home & Living",
    price: 65,
    oldPrice: null,
    rating: 4.5,
    reviews: 92,
    image: "./images/LuminaDeskLamp.jpg",
    badge: "New",
    badgeType: "new",
  },
];

// ============================================================
//  STATE
// ============================================================
let cart = [];
let cartTotal = 0;

// ============================================================
//  DOM REFS
// ============================================================
const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartBadge = document.getElementById("cartBadge");
const cartCount = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("header");
const toast = document.getElementById("toast");

// ============================================================
//  RENDER PRODUCTS
// ============================================================
function renderProducts() {
  productsGrid.innerHTML = products
    .map((p) => {
      const stars =
        "★".repeat(Math.floor(p.rating)) + "☆".repeat(5 - Math.floor(p.rating));
      const oldPriceHtml = p.oldPrice
        ? `<span class="old">$${p.oldPrice}</span>`
        : "";
      const badgeHtml = p.badge
        ? `<span class="badge badge--${p.badgeType || "sale"}">${
            p.badge
          }</span>`
        : "";
      return `
            <div class="product-card" data-id="${p.id}">
                <div class="image-wrap">
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
                    ${badgeHtml}
                    <button class="quick-add" data-id="${p.id}">
                        <i class="fas fa-plus"></i> Quick Add
                    </button>
                    <button class="wishlist-btn" aria-label="Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="info">
                    <div class="product-category">${p.category}</div>
                    <div class="product-title">${p.name}</div>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        ${p.rating} (${p.reviews})
                    </div>
                    <div class="product-price">
                        $${p.price} ${oldPriceHtml}
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const product = products.find((p) => p.id === id);
      if (product) addToCart(product);
    });
  });
}

// ============================================================
//  CART FUNCTIONS
// ============================================================
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`${product.name} added to cart!`);
  cartBadge.style.transform = "scale(1.4)";
  setTimeout(() => (cartBadge.style.transform = "scale(1)"), 300);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCart();
  }
}

function updateCart() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotal = total;

  cartBadge.textContent = count;
  cartCount.textContent = `(${count})`;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  renderCartItems();
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
               
                <p>Ваша корзина пуста</p>
                <small style="font-size:13px;">Начните добавлять потрясающие товары!</small>
            </div>
        `;
    // cartItems.innerHTML = `
    //         <div class="empty-cart">
    //             <i class="fas fa-shopping-bag"></i>
               
    //             <p>Your cart is empty</p>
    //             <small style="font-size:13px;">Start adding some amazing products!</small>
    //         </div>
    //     `;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="item-img">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
                <div class="item-qty">
                    <button data-id="${item.id}" data-delta="-1">−</button>
                    <span>${item.qty}</span>
                    <button data-id="${item.id}" data-delta="1">+</button>
                </div>
            </div>
            <button class="item-remove" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `
    )
    .join("");

  cartItems.querySelectorAll(".item-qty button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const delta = parseInt(btn.dataset.delta);
      updateQty(id, delta);
    });
  });
  cartItems.querySelectorAll(".item-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
    });
  });
}

// ============================================================
//  TOAST
// ============================================================
let toastTimeout;

function showToast(msg) {
  toast.querySelector(
    ".toast-msg"
  ).innerHTML = `${msg} <small>Item successfully added</small>`;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ============================================================
//  CART SIDEBAR TOGGLE
// ============================================================
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ============================================================
//  HAMBURGER
// ============================================================
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// ============================================================
//  HEADER SCROLL EFFECT
// ============================================================
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y > 60) {
    header.classList.add("header--scrolled");
  } else {
    header.classList.remove("header--scrolled");
  }
});

// ============================================================
//  SCROLL REVEAL (only for non-product sections)
// ============================================================
const revealElements = document.querySelectorAll(".reveal:not(.product-card)");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ============================================================
//  3D TILT ON HERO CARD
// ============================================================
const heroCard = document.getElementById("heroCard3d");
if (heroCard) {
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    heroCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform =
      "perspective(800px) rotateY(-5deg) rotateX(5deg) scale(1)";
  });
}

// ============================================================
//  3D TILT ON PRODUCT CARDS (lightweight)
// ============================================================
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -4;
      const rotY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-12px) scale(1.01)`;
    } else {
      card.style.transform = "";
    }
  });
});

// ============================================================
//  WISHLIST TOGGLE
// ============================================================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".wishlist-btn");
  if (btn) {
    e.preventDefault();
    const icon = btn.querySelector("i");
    icon.classList.toggle("far");
    icon.classList.toggle("fas");
    if (icon.classList.contains("fas")) {
      icon.style.color = "#E85D3A";
      showToast("Added to wishlist ❤️");
    } else {
      icon.style.color = "";
    }
  }
});

// ============================================================
//  NEWSLETTER SUBSCRIBE
// ============================================================
const subscribeBtn = document.querySelector(".newsletter .btn");
const newsletterInput = document.querySelector(".newsletter .form input");
if (subscribeBtn) {
  subscribeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = newsletterInput.value.trim();
    if (email && email.includes("@")) {
      showToast("🎉 Subscribed! Check your inbox.");
      newsletterInput.value = "";
    } else {
      showToast("Please enter a valid email address.");
    }
  });
}

// ============================================================
//  KEYBOARD: ESC to close cart
// ============================================================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart();
    navLinks.classList.remove("open");
  }
});

// ============================================================
//  INIT
// ============================================================
renderProducts();
updateCart();

// Manually reveal any visible non-product sections
setTimeout(() => {
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("visible");
    }
  });
}, 100);

console.log("🔥 BLAZE — Premium E-Commerce ready!");
console.log("✨ Professional product grid with 8 items, smooth animations.");
