import { Request, Response } from "express";
import { Goal } from "../models/Goal";
import { generateFinancialRecommandation } from "../controllers/goal/recommandation";
import { generateRecommandation } from "../services/goal/generateRecommandation";
import { generateInternalServerErrorMessage } from "../helpers/generateErrorResponse";

jest.mock("../models/Goal");
jest.mock("../services/goal/generateRecommandation");
jest.mock("../helpers/generateErrorResponse");

describe("generateFinancialRecommandation", () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { 
      body: { description: "Test", targetAmount: 1000, targetDate: new Date(), user: { id: "user1" } }, 
      params: { id: "goal1" } 
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should generate a recommendation and update the goal", async () => {
    (generateRecommandation as jest.Mock).mockResolvedValue("recommendation123");
    (Goal.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "goal1", recommendation: "recommendation123" });

    await generateFinancialRecommandation(mockReq, mockRes);

    expect(generateRecommandation).toHaveBeenCalledWith({
      description: "Test",
      targetAmount: 1000,
      targetDate: mockReq.body.targetDate,
    });

    expect(Goal.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "goal1", user: "user1" },
      { $set: { recommendation: "recommendation123" } },
      { new: true }
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ _id: "goal1", recommendation: "recommendation123" });
  });

  it("should return 500 if recommendation generation fails", async () => {
    (generateRecommandation as jest.Mock).mockResolvedValue(null);
    (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({ message: "Internal Server Error" });

    await generateFinancialRecommandation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  it("should return 404 if goal is not found", async () => {
    (generateRecommandation as jest.Mock).mockResolvedValue("recommendation123");
    (Goal.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await generateFinancialRecommandation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Objectif non trouvé" });
  });

  it("should handle errors during database update", async () => {
    (generateRecommandation as jest.Mock).mockResolvedValue("recommendation123");
    (Goal.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error("DB error"));

    await generateFinancialRecommandation(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Désolé la recommandation n'a pas pu être générée.",
    });
  });
});
