"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodToken = void 0;
var resultStatus_1 = require("../utils/resultStatus");
var jwt = require('jsonwebtoken');
function decodToken(token, res) {
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded);
        return decoded;
    }
    catch (_a) {
        (0, resultStatus_1.createResponse)(403, 'Session expired please login', res);
    }
}
exports.decodToken = decodToken;
