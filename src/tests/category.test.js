const app = require("../app");
const request = require("supertest");

let categoryId;
let token;

beforeAll(async () => {
  const credentials = {
    userName: "test1",
    password: "test1234",
  };
  res = await request(app).post("/api/v1/users/login").send(credentials);
  token = res.body.token;
});

test("POST /api/v1/categories should create one category", async () => {
  const newCategory = { name: "News" };
  const res = await request(app)
    .post("/api/v1/categories")
    .send(newCategory)
    .set("Authorization", `Bearer ${token}`);
  categoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.name).toBe(newCategory.name);
});

test("GET /api/v1/categories should return all categories", async () => {
  const res = await request(app).get("/api/v1/categories");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE /api/v1/categories/:id should delete one category", async () => {
  const res = await request(app)
    .delete(`/api/v1/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});