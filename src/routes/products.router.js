import { Router } from "express";
import * as productsCtrl from '../controllers/products.controller.js';

const router = Router();

router.get("/", productsCtrl.getProducts);
router.get("/:pid", productsCtrl.getProductById);
router.post("/", productsCtrl.createProduct);
router.put("/:pid", productsCtrl.updateProduct);
router.delete("/:pid", productsCtrl.deleteProduct);

export default router;
