const app = require('../app');
const request = require('supertest');
const Cart = require('../models/Cart');
require('../models');

let token;

beforeAll(async() => {
    const credentials = {
        email: "test@gmail.com",    
        password: "test1234"
    }
    const res = await request(app).post('/api/v1/users/login').send(credentials);
    token = res.body.token;
});

test("should return 200 on successful purchase", async () => {  
    const response = await request(app)
      .post("/api/v1/purchases")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

test("should empty cart on successful purchase", async () => {
    const newProduct = { name: "Test Product", price: 10 };
    const productRes = await request(app)
        .post('/api/v1/products')
        .send(newProduct)
        .set('Authorization', `Bearer ${token}`);
    const productId = productRes.body.id;
      
    const newCartItem = { productId, quantity: 1 };
    await request(app)
        .post('/api/v1/cart')
        .send(newCartItem)
        .set('Authorization', `Bearer ${token}`);
      
    const purchaseRes = await request(app)
        .post('/api/v1/purchase')
        .set('Authorization', `Bearer ${token}`);
      
    const cartItems = await Cart.findAll();
    expect(cartItems).toHaveLength(0);
});
