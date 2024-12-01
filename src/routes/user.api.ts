import { Router } from "express";

import {
  registerUser,
  userInfo,
  retrieveUsers,
  changeUserRole,
} from "../controllers/user";

import authorize from "../middlewares/auth";
import adminAuthorization from "../middlewares/admin";

const router = Router();

router.post("/register", registerUser);

router.get("/user-info", authorize, userInfo);

router.patch("/:id", authorize, adminAuthorization, changeUserRole);

router.get("/users/list", authorize, adminAuthorization, retrieveUsers);

export default router;
