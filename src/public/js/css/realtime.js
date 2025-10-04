// src/public/js/realtime.js
const socket = io();

socket.emit("getProducts");

const productList = document.getElementById("product-list");
const form = document.getElementById("productForm");

socket.on("updateProducts", (products) => {
  if (!productList) return;
  productList.innerHTML = products.map(p =>
    `<li data-id="${p._id}">
      <strong>${p.nombre}</strong> - $${p.precio}
      <button onclick="deleteProduct('${p._id}')">Eliminar</button>
    </li>`
  ).join("");
});

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const product = Object.fromEntries(fd.entries());
    product.precio = Number(product.precio);
    product.disponibilidad = product.disponibilidad === "true";
    socket.emit("newProduct", product);
    form.reset();
  });
}

window.deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};
