import { Router } from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category/category";
import authorize from "../middlewares/auth";
import { getAvailableIcons } from "../controllers/category/icons";

const router = Router();

router.post("/create", authorize, createCategory);
router.get("/", authorize, getCategories);
router.get("/icons", authorize, getAvailableIcons);

export default router;
