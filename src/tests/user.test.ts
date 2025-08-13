import { registerUser, userInfo, retrieveUsers, changeUserRole } from "../controllers/user";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import {
  generateInternalServerErrorMessage,
  generateUnmatchedPasswordsErrorMessage,
  generateUsedEmailErrorMessage,
  generateUnauthorizedErrorMessage,
  generateNotFoundUsersErrorMessage,
  generateNotFoundUserErrorMessage,
} from "../helpers/generateErrorResponse";
import { userRoleChangeSuccess } from "../helpers/generateSuccessResponse";

jest.mock("../models/user");
jest.mock("bcrypt");
jest.mock("../helpers/generateErrorResponse");
jest.mock("../helpers/generateSuccessResponse");

const createMockRequest = (overrides?: Partial<Request>): Request => {
  return {
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    ...overrides,
  } as unknown as Request;
};

const createMockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};


const mockReq = createMockRequest();
const mockRes = createMockResponse();
describe("User Controller", () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("registerUser", () => {
    it("should create a user when passwords match", async () => {
      mockReq = {
        body: {
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          password: "pass123",
          confirmPassword: "pass123",
        },
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
      const saveMock = jest.fn().mockResolvedValue(true);
      (User as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));

      await registerUser(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 12);
      expect(saveMock).toHaveBeenCalled();
    });

    it("should return 400 if passwords do not match", async () => {
      mockReq = {
        body: {
          password: "123",
          confirmPassword: "456",
        },
      };
      (generateUnmatchedPasswordsErrorMessage as jest.Mock).mockReturnValue({ msg: "Passwords mismatch" });

      await registerUser(mockReq, mockRes);

    });

    it("should return 409 if email already exists", async () => {
      mockReq = {
        body: {
          password: "pass123",
          confirmPassword: "pass123",
        },
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
      const saveMock = jest.fn().mockRejectedValue({ code: 11000 });
     (User as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));
      (generateUsedEmailErrorMessage as jest.Mock).mockReturnValue({ msg: "Email used" });

      await registerUser(mockReq, mockRes);

    
    });

    it("should return 500 if save fails with unknown error", async () => {
      mockReq = {
        body: {
          password: "pass123",
          confirmPassword: "pass123",
        },
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
      const saveMock = jest.fn().mockRejectedValue({});
     (User as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));
      (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({ msg: "Internal Error" });

      await registerUser(mockReq, mockRes);

    });
  });

  describe("userInfo", () => {
    it("should return user info if found", async () => {
      mockReq = { body: { user: { id: "123" } } };
      (User.findOne as jest.Mock).mockResolvedValue({ _id: "123", firstname: "John" });

      await userInfo(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ _id: "123" }, { password: 0 });
    });

    it("should return 401 if user not found", async () => {
      mockReq = { body: { user: { id: "123" } } };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (generateUnauthorizedErrorMessage as jest.Mock).mockReturnValue({ msg: "Unauthorized" });

      await userInfo(mockReq, mockRes);
    });

    it("should return 500 if error thrown", async () => {
      mockReq = { body: { user: { id: "123" } } };
      (User.findOne as jest.Mock).mockRejectedValue(new Error());
      (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({ msg: "Internal Error" });

      await userInfo(mockReq, mockRes);
    });
  });

  describe("retrieveUsers", () => {
    it("should return list of users", async () => {
      (User.find as jest.Mock).mockResolvedValue([{ id: "1" }]);
      mockReq = {};
await retrieveUsers(mockReq, mockRes);

      expect(User.find).toHaveBeenCalledWith({}, { password: 0 });
    });

    it("should return 404 if no users found", async () => {
      (User.find as jest.Mock).mockResolvedValue(null);
      (generateNotFoundUsersErrorMessage as jest.Mock).mockReturnValue({ msg: "Not found" });

      await retrieveUsers(mockReq, mockRes);

    });

    it("should return 500 if error thrown", async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error());
      (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({ msg: "Internal Error" });

     await retrieveUsers(mockReq, mockRes);

    });
  });

  describe("changeUserRole", () => {
    it("should update user role if found", async () => {
      const updateMock = jest.fn();
      (User.findOne as jest.Mock).mockResolvedValue({ updateOne: updateMock });
      (userRoleChangeSuccess as jest.Mock).mockReturnValue({ msg: "Role changed" });
      mockReq = { params: { id: "1" }, body: { role: "admin" } };

      await changeUserRole(mockReq, mockRes);

      expect(updateMock).toHaveBeenCalledWith({ role: "admin" });
    });

    it("should return 404 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (generateNotFoundUserErrorMessage as jest.Mock).mockReturnValue({ msg: "User not found" });
      mockReq = { params: { id: "1" }, body: {} };

      await changeUserRole(mockReq, mockRes);

    });

    it("should return 500 if error thrown", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error());
      (generateInternalServerErrorMessage as jest.Mock).mockReturnValue({ msg: "Internal Error" });
      mockReq = { params: { id: "1" }, body: {} };

      await changeUserRole(mockReq, mockRes);

    });
  });
});
