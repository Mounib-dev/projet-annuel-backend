import request from "supertest";
import { app, server } from "../app";

afterAll((done) => {
  server.close(done);
});

describe("GET /api/v1/", () => {
  it("should return 200 OK with the correct message", async () => {
    const response = await request(app).get("/api/v1/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to the API Portal");
  });
});
