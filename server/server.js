const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const products = [
  { id: 1, name: "Футболка", price: 1000 },
  { id: 2, name: "Штаны", price: 2000 },
  { id: 3, name: "Кроссовки", price: 3000 },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
