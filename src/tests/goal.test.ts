import { Request, Response } from "express";
import { Goal } from "../models/Goal";
import {
  createGoal,
  getUserGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from "../controllers/goal/goal";

jest.mock("../models/Goal");

describe("Goal Controller", () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { body: { user: { id: "user1" } }, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("createGoal", () => {
    it("should create a goal successfully", async () => {
      const mockGoal = { _id: "goal1", description: "Test" };
      (Goal.create as jest.Mock).mockResolvedValue(mockGoal);

      mockReq.body = {
        description: "Test",
        targetAmount: 1000,
        targetDate: new Date(),
        estimatedIncomeRange: [0, 2000],
        user: { id: "user1" },
      };

      await createGoal(mockReq, mockRes);

      expect(Goal.create).toHaveBeenCalledWith({
        user: "user1",
        description: "Test",
        targetAmount: 1000,
        targetDate: mockReq.body.targetDate,
        estimatedIncomeRange: [0, 2000],
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockGoal);
    });

    it("should return 500 on error", async () => {
      (Goal.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      await createGoal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });
  });

  describe("getUserGoals", () => {
    it("should return user's goals", async () => {
      const mockGoals = [{ _id: "goal1" }];
      (Goal.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockGoals),
      });

      await getUserGoals(mockReq, mockRes);

      expect(Goal.find).toHaveBeenCalledWith({ user: "user1" });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockGoals);
    });

    it("should handle errors", async () => {
      (Goal.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      });

      await getUserGoals(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });
  });

  describe("getGoalById", () => {
    it("should return a goal if found", async () => {
      const mockGoal = { _id: "goal1" };
      (Goal.findOne as jest.Mock).mockResolvedValue(mockGoal);
      mockReq.params.id = "goal1";

      await getGoalById(mockReq, mockRes);

      expect(Goal.findOne).toHaveBeenCalledWith({ _id: "goal1", user: "user1" });
      expect(mockRes.json).toHaveBeenCalledWith(mockGoal);
    });

    it("should return 404 if goal not found", async () => {
      (Goal.findOne as jest.Mock).mockResolvedValue(null);
      mockReq.params.id = "goal1";

      await getGoalById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Objectif non trouvé" });
    });

    it("should handle errors", async () => {
      (Goal.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
      mockReq.params.id = "goal1";

      await getGoalById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });
  });

  describe("updateGoal", () => {
    it("should update a goal", async () => {
      const mockGoal = { _id: "goal1", description: "Updated" };
      (Goal.findOneAndUpdate as jest.Mock).mockResolvedValue(mockGoal);
      mockReq.params.id = "goal1";
      mockReq.body = { description: "Updated", targetAmount: 2000, targetDate: new Date(), user: { id: "user1" } };

      await updateGoal(mockReq, mockRes);

      expect(Goal.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "goal1", user: "user1" },
        { $set: { description: "Updated", targetAmount: 2000, targetDate: mockReq.body.targetDate } },
        { new: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockGoal);
    });

    it("should return 404 if goal not found", async () => {
      (Goal.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      mockReq.params.id = "goal1";
      mockReq.body = { description: "Updated", targetAmount: 2000, targetDate: new Date(), user: { id: "user1" } };

      await updateGoal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Objectif non trouvé" });
    });

    it("should handle errors", async () => {
      (Goal.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error("DB error"));
      mockReq.params.id = "goal1";
      mockReq.body = { description: "Updated", targetAmount: 2000, targetDate: new Date(), user: { id: "user1" } };

      await updateGoal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteGoal", () => {
    it("should delete a goal", async () => {
      (Goal.findOneAndDelete as jest.Mock).mockResolvedValue({});
      mockReq.params.id = "goal1";

      await deleteGoal(mockReq, mockRes);

      expect(Goal.findOneAndDelete).toHaveBeenCalledWith({ _id: "goal1", user: "user1" });
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 if goal not found", async () => {
      (Goal.findOneAndDelete as jest.Mock).mockResolvedValue(null);
      mockReq.params.id = "goal1";

      await deleteGoal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Objectif non trouvé" });
    });

    it("should handle errors", async () => {
      (Goal.findOneAndDelete as jest.Mock).mockRejectedValue(new Error("DB error"));
      mockReq.params.id = "goal1";

      await deleteGoal(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
