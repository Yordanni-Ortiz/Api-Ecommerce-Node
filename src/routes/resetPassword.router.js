const express = require('express');
const { requestResetPassword, validateResetToken, resetPassword } = require('../controllers/resetPassword.controllers');

const resetPasswordRouter = express.Router();

resetPasswordRouter.route('/request-reset-password')
  .post(requestResetPassword);

resetPasswordRouter.route('/reset-password/:token')
  .get(validateResetToken)
  .post(resetPassword)
    
module.exports = resetPasswordRouter;


