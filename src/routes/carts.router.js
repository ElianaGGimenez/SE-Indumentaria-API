import { Router } from "express";
import {
  createCart,
  getCart,
  addProductToCart
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCart);
router.post("/:cid/product/:pid", addProductToCart);

export default router;
