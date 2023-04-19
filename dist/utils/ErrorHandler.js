"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseErrorHandler = exports.ErrorCodeStatus = void 0;
var ErrorCodeStatus;
(function (ErrorCodeStatus) {
    ErrorCodeStatus[ErrorCodeStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorCodeStatus[ErrorCodeStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCodeStatus[ErrorCodeStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorCodeStatus[ErrorCodeStatus["UNAUTHRIZED"] = 401] = "UNAUTHRIZED";
    ErrorCodeStatus[ErrorCodeStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    ErrorCodeStatus[ErrorCodeStatus["NOTACCEPTABLE"] = 406] = "NOTACCEPTABLE";
    ErrorCodeStatus[ErrorCodeStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ErrorCodeStatus[ErrorCodeStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    ErrorCodeStatus[ErrorCodeStatus["TIME_OUT_ERROR"] = 599] = "TIME_OUT_ERROR";
})(ErrorCodeStatus = exports.ErrorCodeStatus || (exports.ErrorCodeStatus = {}));
var responseErrorHandler = function (status, data, res) {
    res.status(status).send({
        status: status,
        data: data,
    });
};
exports.responseErrorHandler = responseErrorHandler;
