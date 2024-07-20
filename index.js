const express = require("express");
const bodyParser = require("body-parser");
// const swaggerUI = require("swagger-ui-express");
// const swaggerSpec = require("./swagger");

const mainRoutes = require('./routes/mainRoutes')
// const AuthController = require("./auth/authController");
// new AuthController();


const app = express();

app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
app.use(bodyParser.json({ limit: '500mb' }));

app.use('/api', mainRoutes);

app.use(function (req, res, next) {
    next();
});
app.use(function (err, req, res, next) {
    // res.header("Access-Control-Allow-Origin", null);
    // res.removeHeader("Access-Control-Allow-Origin");
    // delete res.header("Access-Control-Allow-Origin");
    //res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //res.header('server', "mobeserv");
    if (err) {
        // error handling logic
        res.status(500).send({ type: false, message: err.message });
    } else {
        next();
    }
});
// Serve Swagger documentation
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Your API routes go here

app.listen(3000, () => {
console.log("Server is running on port 3000");
});