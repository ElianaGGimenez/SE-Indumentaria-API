import { Router } from "express";
import {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  replaceCartProducts,
  updateProductQuantity,
  emptyCart
} from "../controllers/carts.controller.js"; 

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCart);
router.post("/:cid/product/:pid", addProductToCart);

router.delete("/:cid/products/:pid", deleteProductFromCart);
router.put("/:cid", replaceCartProducts);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid", emptyCart);

export default router;
