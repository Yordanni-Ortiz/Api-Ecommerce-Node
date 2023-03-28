const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getAll = catchError(async(req, res) => {
    const results = await Purchase.findAll({ include: [Product], where: { userId: req.user.id } });
    return res.json(results);
});

const purchaseCart = catchError(async(req, res) => {
    const cart = await Cart.findAll({ 
        where: { userId: req.user.id },
        attributes: [ 'quantity', 'productId', 'userId' ],
        raw: true 
    });
    await Purchase.bulkCreate(cart)
    await Cart.destroy({ where: { userId: req.user.id } })
    return res.json(cart)
});

module.exports = {
    getAll,
    purchaseCart
}