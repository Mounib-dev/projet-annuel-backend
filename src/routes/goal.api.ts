import express from "express";
import {
  createGoal,
  getUserGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from "../controllers/goal/goal";
import authorize from "../middlewares/auth";
import { generateFinancialRecommandation } from "../controllers/goal/recommandation";

const router = express.Router();

router.use(authorize);

router.post("/", createGoal);
router.get("/", getUserGoals);
router.get("/:id", getGoalById);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

router.post("/recommandation/:id", generateFinancialRecommandation);

export default router;
