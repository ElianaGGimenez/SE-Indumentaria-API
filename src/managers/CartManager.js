import { readJSON, writeJSON, ensureFile } from "../utils/fileSystem.js";

export default class CartManager {
  constructor(path) {
    this.path = path;
    ensureFile(this.path);
  }

  async _all() {
    return await readJSON(this.path);
  }

  async _save(list) {
    await writeJSON(this.path, list);
  }

  async createCart() {
    const list = await this._all();
    const nextId =
      list.length === 0 ? 1 : Math.max(...list.map(c => parseInt(c.id, 10) || 0)) + 1;

    const newCart = { id: nextId, products: [] };
    list.push(newCart);
    await this._save(list);
    return newCart;
  }

  async getCartById(id) {
    const list = await this._all();
    return list.find(c => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId) {
    const list = await this._all();
    const cartIdx = list.findIndex(c => String(c.id) === String(cartId));
    if (cartIdx === -1) return null;

    const products = list[cartIdx].products || [];
    const item = products.find(p => String(p.product) === String(productId));

    if (item) {
      item.quantity += 1;
    } else {
      products.push({ product: Number(productId), quantity: 1 });
    }
    list[cartIdx].products = products;

    await this._save(list);
    return list[cartIdx];
  }
}
