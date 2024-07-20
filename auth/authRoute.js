const express = require('express');

const app = express();

const AuthController = require('../auth/authController');
const authController = new AuthController();
// /api/auth/createXAuthToken
app.route('/createXAuthToken').post(authController.createAuthTokenAPI);

// /api/auth/validatedClient
app.route('/validatedClient').post(authController.validateToken, authController.validateClientAccessAPI);

module.exports = app;