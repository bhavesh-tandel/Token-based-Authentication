const AuthService = require('./authService');
const CALData = require('../data/clientAccessList.json');
const authservice = new AuthService();

class AuthController {

    clientAccessList = [];
    constructor() {
        // authservice = new AuthService();
        this.setClientAccessList();
        // this.validateClientAccess();
    }

    setClientAccessList() {
        this.clientAccessList = CALData;
        authservice.setClientAccessList(this.clientAccessList);
    }

    validateClientAccess() {
        const token = authservice.createAuthToken();
        const client = authservice.validateUser(token);
        console.log("client", client);
        return client;
    }

    validateToken(req, res, next) {
        let token = req.query['xauth_token'] || req.query['xt'];
        res.statusCode = 401
        if (token) {
            const client = authservice.validateUser(token);
            if (client.err) {
                return res.json({
                    err: true,
                    message: client.message
                });
            } else {
                req.clientAccess = client.data;
                next();
            }
        } else {
            return res.json({
                err: true,
                message: "Token is invalid"
            });
        }
    }

    validateClientAccessAPI(req, res) {
        const { xauth_token } = req.body;
        // const token = authservice.createAuthToken();
        const authservice = new AuthService();
        const client = authservice.validateUser(xauth_token);
        console.log("client", client);
        var result = { err: true, message: null, data: null };
        res.statusCode = 401;

        if (!client.err) {
            res.statusCode = 200;
            result.err = false;
            result.data = client;
        }

        return res.json({
            err: result.err,
            message: client.message
        })
    }

    // API
    createAuthTokenAPI(req, res) {
        const { ClientId, Secret_key } = req.body;
        const authservice = new AuthService();
        const xauth_token = authservice.createAuthToken(ClientId, Secret_key);
        var result = { err: true, message: null, data: null };
        res.statusCode = 401;

        if (xauth_token) {
            res.statusCode = 200;
            result.err = false;
            result.data = xauth_token;
        }

        return res.json({
            err: result.err,
            data: result.data,
            message: result.message
        })
    }
}

module.exports = AuthController;