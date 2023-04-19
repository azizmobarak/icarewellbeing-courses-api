"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseConnection = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
function createDatabaseConnection() {
    if (process.env.DB) {
        return mongoose_1.default.connect(process.env.DB);
    }
    throw new Error('please add DB connection string to .env file');
}
exports.createDatabaseConnection = createDatabaseConnection;
