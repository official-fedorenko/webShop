// массив товаров

async function loadProducts() {
  try {
    const res = await fetch(
      "https://webshop-backends.onrender.com/api/products"
    ); // Запрос к API
    const data = await res.json();

    data.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <button>Добавить в корзину</button>
      `;
      productList.appendChild(card);

      const addButton = card.querySelector("button");
      addButton.addEventListener("click", () => {
        const existingItem = cart.find((product) => product.id === item.id);
        if (existingItem) {
          existingItem.count += 1;
        } else {
          cart.push({ ...item, count: 1 });
        }

        const totalQuantity = cart.reduce((sum, p) => sum + p.count, 0);
        cartCount.textContent = totalQuantity;
        renderCart();
        saveCart();
      });
    });
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
  }
}

let cart = [];

const productList = document.getElementById("product-list"); // Список товаров
const cartCount = document.getElementById("cart-count"); // Счетчик товаров в корзине

// модальное окно корзины
const cartButton = document.getElementById("cart-toggle"); // кнопка "Корзина"
const cartCloseButton = document.getElementById("cart-close"); // кнопка "Закрыть корзину"
cartButton.addEventListener("click", () => {
  renderCart(); // отображаем товары в корзине
  document.getElementById("cart-window").style.display = "flex"; // открываем модальное окно
  confirmBox.style.display = "none"; // скрываем модальное окно подтверждения
});
cartCloseButton.addEventListener("click", () => {
  document.getElementById("cart-window").style.display = "none"; // закрываем модальное окно
});

// отображаем товары в корзине
const cartItems = document.getElementById("cart-items"); // список товаров в корзине
const cartTotal = document.getElementById("cart-total"); // общая стоимость товаров в корзине
const checkoutBtn = document.getElementById("checkout-btn"); // кнопка "Оформить заказ"
const checkoutForm = document.getElementById("checkout-form"); // форма оформления заказа
const orderSuccess = document.getElementById("order-success"); // сообщение об успешном заказе

checkoutBtn.addEventListener("click", () => {
  checkoutForm.style.display = "flex"; // открываем форму оформления заказа
  checkoutBtn.style.display = "none"; // скрываем кнопку "Оформить заказ"
  cartItems.style.display = "none"; // скрываем список товаров в корзине
});

function renderCart() {
  cartItems.innerHTML = ""; // очищаем список товаров в корзине
  let totalPrice = 0; // общая стоимость товаров
  let totalCount = 0; // общее количество

  cart.forEach((item, index) => {
    totalPrice += item.price * item.count; // стоимость товара × количество
    totalCount += item.count;

    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <h3>${item.name}</h3>
      <p>Цена: ${item.price} × ${item.count} = ${item.price * item.count}</p>
    `;

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("quantity-btn");
    plusBtn.addEventListener("click", () => {
      item.count++;
      saveCart();
      renderCart();
    });

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("quantity-btn");
    minusBtn.addEventListener("click", () => {
      if (item.count > 1) {
        item.count--;
      } else {
        cart.splice(index, 1);
      }
      saveCart();
      renderCart();
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.classList.add("delete-btn");
    removeButton.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });

    const controls = document.createElement("div");
    controls.classList.add("cart-item-controls");

    controls.appendChild(minusBtn);
    controls.appendChild(plusBtn);
    controls.appendChild(removeButton);

    cartItem.appendChild(controls);
    cartItems.appendChild(cartItem);
  });

  cartTotal.textContent = totalPrice;
  cartCount.textContent = totalCount;

  clearCartButton.style.display = cart.length > 0 ? "block" : "none";
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart)); // сохраняем корзину в localStorage
} // сохраняем корзину в localStorage

const confirmBox = document.getElementById("confirm-clear"); // модальное окно подтверждения
const confirmYes = document.getElementById("confirm-yes"); // кнопка "Да"
const confirmNo = document.getElementById("confirm-no"); // кнопка "Нет"

// Загрузка корзины из localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart"); // получаем корзину из localStorage
  if (savedCart) {
    cart = JSON.parse(savedCart); // парсим корзину из JSON
    const totalQuantity = cart.reduce((sum, item) => sum + item.count, 0);
    cartCount.textContent = totalQuantity;
    renderCart(); // отображаем товары в корзине
  }
} // загружаем корзину из localStorage

// Сброс корзины
const clearCartButton = document.getElementById("clear-cart"); // кнопка "Очистить корзину"
clearCartButton.addEventListener("click", () => {
  clearCartButton.style.display = "none"; // скрываем кнопку "Очистить корзину"
  confirmBox.style.display = "block"; // открываем модальное окно подтверждения
});

// обработчик события на кнопку "Очистить корзину"
confirmYes.addEventListener("click", () => {
  cart = [];
  cartCount.textContent = cart.length; // обновляем счетчик корзины
  renderCart(); // обновляем корзину
  saveCart(); // 💾 сохранить после очистки
  confirmBox.style.display = "none"; // закрываем модальное окно подтверждения
}); // обработчик события на кнопку "Да"

// обработчик события на кнопку "Нет"
confirmNo.addEventListener("click", () => {
  confirmBox.style.display = "none"; // закрываем модальное окно подтверждения
  clearCartButton.style.display = "block"; // показываем кнопку "Очистить корзину"
}); // обработчик события на кнопку "Нет"
loadProducts(); // загрузка товаров при загрузке страницы
loadCart(); // загружаем корзину при загрузке страницы
