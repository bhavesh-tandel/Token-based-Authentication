var crypto = require("crypto");
clientAccessList = {};
class AuthService {

    constructor() {
        // console.log(this.createAuthToken());
    }

    getClientAccessList() {
        return clientAccessList;
    }
    setClientAccessList(list = []) {
        if (Array.isArray(list)) {
            var clientList = {};
            list.forEach(item => {
                clientList[item["ClientId"]] = item;
            })
            clientAccessList = clientList;
        }
    }
    findClientAccess(clientId) {
        return clientAccessList[clientId];
    }
    validateUser(token) {
        if (!token) return { err: true, data: "Token is empty." };

        var params = this.extractAuthToken(token);
        var clientAccessItem = null;
        if (params) {
            const challenge = params["challenge"];
            const client_id = params["client_id"];
            const xauth_token = params["xauth_token"];
            if (params["challenge"]) {
                // var time = Math.round(challenge;
                var currentTime = Math.round(new Date().getTime() / 1000);
                var diff = currentTime - challenge;
                const seconds = Math.floor(diff);
                if (seconds > 20) { // if time is greater than 20 seconds then token will be expiry 
                    return { err: true, message: "challange too long" , data: null };
                }
            } else {
                return { err: true, message: "challange is invalid" , data: null };
            }
            if (params["client_id"]) {
                clientAccessItem = this.findClientAccess(client_id);
                if (!clientAccessItem) {
                    return { err: true, message: "client is invalid" , data: null };
                }
            } else {
                return { err: true, message: "client id is invalid" , data: null };
            }
            if (params["xauth_token"]) {
                var data = clientAccessItem["ClientId"] + ":" + challenge; // + ":" + account_number;
                var hmac = crypto.createHmac('MD5', clientAccessItem["Secret_key"]);
                hmac.update(data);
                var hash = hmac.digest('base64');
                hash = hash.replace(/=/g, "");
                hash = hash.replace(/\+/g, "-");
                hash = hash.replace(/\//g, "_");

                if (hash != xauth_token) {
                    return { err: true, message: "xauth token is invalid" , data: null };
                }
            } else {
                return { err: true, message: "xauth token is invalid" , data: null };
            }
            if(clientAccessItem){
                if(clientAccessItem["Active"] !== "1"){
                    return { err: true, message: "client is inactive" , data: null };
                }
            } else {
                return { err: true, message: "client is invalid" , data: null };
            }

            return { err: false, message: "client is valid", data: clientAccessItem };
        }
    }
    createAuthToken(ClientId, Secret_key) {
        var CLIENT_ID = ClientId || "ABC1234";
        var SECRET_KEY = Secret_key || "btfMPni8t10b6t7ACAWsy55SLpZBgIRI";
        var challenge = Math.round(new Date().getTime() / 1000);


        var data = CLIENT_ID + ":" + challenge; // + ":" + account_number;
        var hmac = crypto.createHmac('MD5', SECRET_KEY);
        hmac.update(data);
        var hash = hmac.digest('base64');

        hash = hash.replace(/=/g, "");
        hash = hash.replace(/\+/g, "-");
        hash = hash.replace(/\//g, "_");

        var xt_token_code = "client_id=" + CLIENT_ID + "&challenge=" + challenge + "&xauth_token=" + hash;

        var xt = Buffer.from(xt_token_code)
            .toString('base64');
        xt = xt.replace(/=/g, "");
        xt = xt.replace(/\+/g, "-");
        xt = xt.replace(/\//g, "_");
        return xt;
    }
    extractAuthToken(token) {
        if (!token) {
            return null;
        }
        var xauth_token = Buffer.from(token, "base64").toString("ascii");
        var list = xauth_token.split("&");
        var params = {};
        for (var x in list) {
            var item = list[x].split("=");
            if (item && Array.isArray(item) && item.length > 0) {
                params[item[0]] = item[1];
            }
        }
        return params;
    }
}

module.exports = AuthService;