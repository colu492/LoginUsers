import { Router } from "express";
import { renderProductsView } from "../controllers/products.views.controller.js";

const router = Router();

router.get("/", renderProductsView);

export default router;

