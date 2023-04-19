"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var courseSchema = new mongoose_1.default.Schema({
    video: {
        type: String,
        max: 1000,
        min: 4,
        required: true,
    },
    user_id: {
        type: String,
        max: 400,
        min: 2,
        required: true,
    },
    name: {
        type: String,
        required: true,
        max: 250,
    },
    description: {
        type: String,
        required: true,
        max: 250,
    }
});
exports.CoursesModel = mongoose_1.default.model('course', courseSchema);
