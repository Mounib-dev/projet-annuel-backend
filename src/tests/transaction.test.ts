import { createTransaction, retrieveTransactions } from "../controllers/transaction/transaction";
import { Transaction } from "./../models/Transaction";
import { Balance } from "./../models/Balance";
import * as goalService from "./../services/goal/updateRecommandationReady";

jest.mock("../models/Transaction");
jest.mock("../models/Balance");
jest.mock("../services/goal/updateRecommandationReady");

describe("Transaction Controller (unit tests)", () => {
  const mockUser = { id: "user123" };

  let mockReq: any;
  let mockRes: any;

 let mockNext: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockReq = { body: { user: mockUser } };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  mockNext = jest.fn();
});

  describe("createTransaction", () => {
    it("should create an expense transaction and update balance", async () => {
      mockReq.body = {
        transactionType: "expense",
        category: "Food",
        amount: 20,
        description: "Lunch",
        date: "2025-08-13",
        user: mockUser,
      };

      (Transaction.prototype.save as jest.Mock).mockResolvedValueOnce({});
      (Balance.findOne as jest.Mock).mockResolvedValueOnce({
        amount: 100,
        save: jest.fn().mockResolvedValue({}),
      });
      (goalService.updateRecommendationReady as jest.Mock).mockResolvedValueOnce({});

     await createTransaction(mockReq, mockRes, mockNext);


      expect(Transaction.prototype.save).toHaveBeenCalled();
      expect(Balance.findOne).toHaveBeenCalledWith({ user: mockUser.id });
      expect(goalService.updateRecommendationReady).toHaveBeenCalledWith(mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Transaction created successfully" });
    });

    it("should return 404 if balance not found", async () => {
      mockReq.body = { transactionType: "income", amount: 50, user: mockUser };
      (Transaction.prototype.save as jest.Mock).mockResolvedValueOnce({});
      (Balance.findOne as jest.Mock).mockResolvedValueOnce(null);

      await createTransaction(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if save fails", async () => {
      mockReq.body = { transactionType: "income", amount: 50, user: mockUser };
      (Transaction.prototype.save as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

     await createTransaction(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("retrieveTransactions", () => {
    it("should return user transactions", async () => {
      (Transaction.find as jest.Mock).mockResolvedValueOnce([{ amount: 20, type: "expense" }]);

      await retrieveTransactions(mockReq, mockRes, mockNext);

      expect(Transaction.find).toHaveBeenCalledWith({ user: mockUser.id });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([{ amount: 20, type: "expense" }]);
    });

    it("should return 404 if no transactions found", async () => {
      (Transaction.find as jest.Mock).mockResolvedValueOnce(null);

      await retrieveTransactions(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if find fails", async () => {
      (Transaction.find as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await retrieveTransactions(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
