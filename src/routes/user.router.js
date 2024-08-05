const { getAll, create, getOne, remove, update, login, changePassword, uploadProfileImage } = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require("../utils/verifyJWT");

const userRouter = express.Router();

userRouter.route('/')
    .get(verifyJWT, getAll)
    .post(create);

userRouter.route('/login')
    .post(login);

userRouter.route('/change-password')
    .post(verifyJWT, changePassword); 

userRouter.route('/upload-profile-image')
    .post(verifyJWT, uploadProfileImage);

userRouter.route('/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = userRouter;