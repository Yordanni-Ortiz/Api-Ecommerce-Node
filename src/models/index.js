const Cart = require("./Cart");
const Category = require("./Category");
const Product = require("./Product");
/*const ProductImg = require("./ProductImg");*/
const Purchase = require("./Purchase");
const User = require("./User");
const CloudinaryImg = require("./CloudinaryImg")

Product.belongsTo(Category);
Category.hasMany(Product);

CloudinaryImg.belongsTo(Product);
Product.hasMany(CloudinaryImg);

Cart.belongsTo(User);
User.hasMany(Cart);

Cart.belongsTo(Product);
Product.hasMany(Cart);

Purchase.belongsTo(User);
User.hasMany(Purchase);

Purchase.belongsTo(Product);
Product.hasMany(Purchase);