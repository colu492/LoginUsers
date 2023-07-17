import { Router } from "express";
import { renderRealTimeProducts } from "../controllers/realTimeProducts.controller.js";

const router = Router();

router.get("/", renderRealTimeProducts);

export default router;
