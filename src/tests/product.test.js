const app = require("../app");
const request = require("supertest");
const ProductImg = require("../models/ProductImg");
require("../models");

let token;
let productId;
let product;

beforeAll(async () => {
  const credentials = {
    userName: "test1",
    password: "test1234",
  };
  res = await request(app).post("/api/v1/users/login").send(credentials);
  token = res.body.token;
});

test("POST /api/v1/products should create one product", async () => {
  const product = {
    title: "iPhone 14 Pro Max",
    description:
      "La pantalla del iPhone 14 Pro Max tiene esquinas redondeadas que siguen el elegante diseño curvo del teléfono, y las esquinas se encuentran dentro de un rectángulo estándar. Si se mide en forma de rectángulo estándar, la pantalla tiene 6.69 pulgadas en diagonal (el área real de visualización es menor).",
    price: "1720",
  };
  const res = await request(app)
    .post("/api/v1/products")
    .send(product)
    .set("Authorization", `Bearer ${token}`);
  productId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.title).toBe(product.title);
});

test("POST /api/v1/products/:id/images should set the product images", async () => {
  const image = await ProductImg.create({
    url: "crearteImage",
    filename: "crearteImageTest",
    publicId: "somePublicId",
  });
  const res = await request(app)
    .post(`/api/v1/products/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("GET /api/v1/products should return all products", async () => {
  const res = await request(app).get("/api/v1/products");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("GET /api/v1/products/:id should return one product", async () => {
  const res = await request(app)
    .get(`/api/v1/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  product = res.body;
  expect(res.status).toBe(200);
  expect(product).toBeDefined();
});

test("PUT /api/v1/products/:id should update one product", async () => {
  const body = {
    title: "iPhone 14 Pro Max update",
  };
  const res = await request(app)
    .put(`/api/v1/products/${productId}`)
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(body.title);
});

test("DELETE /api/v1/products/:id should delete one product", async () => {
  const res = await request(app)
    .delete(`/api/v1/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
