"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = void 0;
var createResponse = function (status, data, res) {
    res.status(status).send({
        status: status,
        data: data,
    });
};
exports.createResponse = createResponse;
