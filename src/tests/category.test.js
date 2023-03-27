const app = require('../app');
const request = require('supertest');

test("POST /categories should create one category", async() => {
    const newCategory = { name: "News" };
    const res = await request(app)
        .post('categories')
        .send(newCategory);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newCategory.name);
})