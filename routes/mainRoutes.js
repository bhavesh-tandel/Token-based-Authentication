const express = require('express');
const app = express();
// const router = express.Router();

const authRoute = require('../auth/authRoute');
// api/auth
app.use('/auth', authRoute);

module.exports = app;