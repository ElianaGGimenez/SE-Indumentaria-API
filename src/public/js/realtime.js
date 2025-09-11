const socket = io();
const form = document.getElementById("productForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());
  product.precio = Number(product.precio);
  socket.emit("newProduct", product);
  form.reset();
});
