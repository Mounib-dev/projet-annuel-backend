import { createCategory, getCategories } from "../controllers/category/category";
import Category from "../models/Category";
import { availableIcons } from "../data/icons";

jest.mock("../models/Category");

describe("Category Controller", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("createCategory", () => {
    it("should create a new category with valid data", async () => {
      mockReq.body = { title: "Travel", icon: "✈️" };

    
      const saveMock = jest.fn().mockResolvedValue({});
      const categoryInstance: any = { title: "Travel", icon: "✈️", save: saveMock };
      (Category as any).mockImplementation(() => categoryInstance);

      await createCategory(mockReq, mockRes, mockNext);
    });

    it("should return 400 if title or icon is missing", async () => {
      mockReq.body = { title: "", icon: "" };

      await createCategory(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Champs requis manquants" });
    });

    it("should return 400 if icon is invalid", async () => {
      mockReq.body = { title: "Test", icon: "INVALID_ICON" };

      await createCategory(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Icône non valide" });
    });

    it("should call next on save error", async () => {
      mockReq.body = { title: "Travel", icon: "✈️" };
      const saveMock = jest.fn().mockRejectedValue(new Error("DB error"));
      const categoryInstance: any = { title: "Travel", icon: "✈️", save: saveMock };
      (Category as any).mockImplementation(() => categoryInstance);

      await createCategory(mockReq, mockRes, mockNext);

    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ title: "Food", icon: "🍔" }];
      (Category.find as jest.Mock).mockResolvedValueOnce(mockCategories);

      await getCategories(mockReq, mockRes);

      expect(Category.find).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockCategories);
    });

    it("should handle errors and return 500", async () => {
      (Category.find as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await getCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
    });
  });
});
