const app = require("../app");
const request = require("supertest");
const Product = require("../models/Product");
require("../models");

let token;
let cartId;

beforeAll(async () => {
  const credentials = {
    userName: "test1",
    password: "test1234",
  };
  res = await request(app).post("/api/v1/users/login").send(credentials);
  token = res.body.token;
});

test("POST /api/v1/cart should create one cart", async () => {
  const product = await Product.create({
    title: "iPhone 14 Pro Max",
    description:
      "The iPhone 14 Pro Max has rounded corners that follow the phone's sleek curved design, and the screen measures 6.69 inches",
    price: "1720",
  });
  const cart = {
    quantity: 1,
    productId: product.id,
  };
  const res = await request(app)
    .post("/api/v1/cart")
    .send(cart)
    .set("Authorization", `Bearer ${token}`);
  cartId = res.body.id;
  await product.destroy();
  expect(res.statusCode).toBe(201);
  expect(res.body.quantity).toBe(cart.quantity);
});

test("GET /api/v1/cart should retorn all cart products", async () => {
  const res = await request(app)
    .get("/api/v1/cart")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT /api/v1/cart/:id should update the cart", async () => {
  const cartUpdate = { quantity: 2 };
  const res = await request(app)
    .put(`/api/v1/cart/${cartId}`)
    .send(cartUpdate)
    .set("Authorization", `Bearer ${token}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.quantity).toBe(cartUpdate.quantity);
});

test("DELETE /api/v1/cart/:id should delete the cart", async () => {
  const res = await request(app)
    .delete(`/api/v1/cart/${cartId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});