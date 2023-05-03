// middleware de multer
const { getAll, create, remove } = require('../controllers/cloudinaryImg.controllers')
const upload = require('../utils/multer');
const express = require('express');
// ...
const cloudinaryImagesRouter = express.Router();


cloudinaryImagesRouter.route('/')
    .get(getAll)
    .post(upload.single('image'), create);

cloudinaryImagesRouter.route('/:id')
    .delete(remove);

module.exports = cloudinaryImagesRouter;