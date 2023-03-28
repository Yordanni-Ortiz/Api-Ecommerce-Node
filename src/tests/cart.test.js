const app = require('../app');
const request = require('supertest');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
require("../models");

let token;
let cartId;

beforeAll(async() => {
    const credentials = {
        email: "test@gmail.com",    
        password: "test1234"
    }
    res = await request(app).post('/api/v1/users/login').send(credentials);
    token = res.body.token;
});

test("POST /api/v1/carts should create one cart", async() => {
    const product = await Product.create({
        title: "iPhone 14 Pro Max",
        description: "La pantalla del iPhone 14 Pro Max tiene esquinas redondeadas que siguen el elegante diseño curvo del teléfono, y las esquinas se encuentran dentro de un rectángulo estándar. Si se mide en forma de rectángulo estándar, la pantalla tiene 6.69 pulgadas en diagonal (el área real de visualización es menor).",
        price: "1720"
    })
    const cart = {
        quantity: 1,
        productId: product.id
    }
    const res = await request(app)
        .post('/api/v1/carts')
        .send(cart)
        .set('Authorization', `Bearer ${token}`);
        cartId = res.body.id;
    await product.destroy();
    expect(res.statusCode).toBe(201); 
    expect(res.body.quantity).toBe(cart.quantity);

}); 

test("GET /api/v1/carts should retorn all cart products", async() => {
    const res = await request(app)
        .get('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200); 
    expect(res.body).toHaveLength(1);
});

test("PUT /api/v1/carts/:id should update the cart", async () => {
    const cartUpdate = { quantity: 2 };
    const res = await request(app)
      .put(`/api/v1/carts/${cartId}`)
      .send(cartUpdate)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(cartUpdate.quantity);
  });

  test("DELETE /api/v1/carts/:id should delete the cart", async () => {
    const res = await request(app)
      .delete(`/api/v1/carts/${cartId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });