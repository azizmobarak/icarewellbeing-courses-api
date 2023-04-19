"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        max: 200,
        min: 4,
        required: true,
    },
    username: {
        type: String,
        max: 200,
        min: 2,
        required: true,
    },
    password: {
        required: true,
        type: String,
        max: 400,
    },
    role: {
        type: String,
        enum: [0, 1, 2],
    }
});
exports.UserModel = mongoose_1.default.model('user', userSchema);
