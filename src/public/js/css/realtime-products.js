// src/public/js/realtime-products.js
const socket = io();

// request initial products
socket.emit("getProducts");

socket.on("updateProducts", (products) => {
  const list = document.getElementById("products-list");
  if (!list) return;
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <button data-id="${p._id}" class="btn-delete">Eliminar</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      socket.emit("deleteProduct", id);
    });
  });
});

const createForm = document.getElementById("create-product-form");
if (createForm) {
  createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = createForm.title.value;
    const price = Number(createForm.price.value);
    const category = createForm.category.value;
    const image = createForm.image.value;
    socket.emit("newProduct", { title, price, category, image });
    createForm.reset();
  });
}
