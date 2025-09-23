import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import { UserModel } from "../modules/users/repositories/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Tasks API", () => {
  let mongoServer;
  let authToken;
  let projectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = "test-secret";
    await mongoose.connect(uri);
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await UserModel.create({ name: "Test User", email: "test@example.com", passwordHash });
    authToken = jwt.sign({ sub: user._id.toString(), email: user.email, name: user.name }, process.env.JWT_SECRET);

    // Create a project for tasks
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Proj", description: "Desc" });
    projectId = res.body._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("create, list with filters/pagination, update, delete", async () => {
    const create1 = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "T1", status: "todo", priority: "high", projectId });
    expect(create1.status).toBe(201);

    const create2 = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "T2", status: "in-progress", priority: "low", projectId });
    expect(create2.status).toBe(201);

    const listAll = await request(app)
      .get(`/api/tasks/project/${projectId}?page=1&limit=1`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(listAll.status).toBe(200);
    expect(listAll.body.items.length).toBe(1);
    expect(listAll.body.total).toBeGreaterThanOrEqual(2);

    const filterStatus = await request(app)
      .get(`/api/tasks/project/${projectId}?status=todo`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(filterStatus.status).toBe(200);
    expect(filterStatus.body.items.some((t) => t.status !== "todo")).toBe(false);

    const idToUpdate = create1.body._id;
    const updated = await request(app)
      .patch(`/api/tasks/${idToUpdate}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ status: "done" });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("done");

    const del = await request(app)
      .delete(`/api/tasks/${idToUpdate}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(del.status).toBe(204);
  });
});


