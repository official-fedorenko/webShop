// server/server.js

const express = require("express"); // подключаем Express
const cors = require("cors"); // подключаем CORS

const app = express();

// Разрешаем CORS для всех источников (временно, можно ограничить)
app.use(
  cors({
    origin: "https://official-fedorenko.github.io", // разрешить запросы с GitHub Pages
  })
);
// Простой массив товаров
const products = [
  { id: 1, name: "Футболка", price: 1000 },
  { id: 2, name: "Штаны", price: 2000 },
  { id: 3, name: "Кроссовки", price: 3000 },
  { id: 4, name: "Куртка", price: 4000 },
  { id: 5, name: "Шапка", price: 5000 },
  { id: 6, name: "Перчатки", price: 6000 },
];

// Обрабатываем GET-запрос по адресу /api/products
app.get("/api/products", (req, res) => {
  res.json(products); // отправляем массив товаров в формате JSON
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
