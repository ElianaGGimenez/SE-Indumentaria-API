// src/routes/carts.router.js
import { Router } from "express";
import * as cartsCtrl from "../controllers/carts.controller.js";

const router = Router();

router.post("/", cartsCtrl.createCart);
router.get("/:cid", cartsCtrl.getCart);
router.post("/:cid/product/:pid", cartsCtrl.addProductToCart);

router.delete("/:cid/products/:pid", cartsCtrl.removeProductFromCart);
router.put("/:cid", cartsCtrl.updateCartProducts);
router.put("/:cid/products/:pid", cartsCtrl.updateProductQuantity);
router.delete("/:cid", cartsCtrl.clearCart);

export default router;
