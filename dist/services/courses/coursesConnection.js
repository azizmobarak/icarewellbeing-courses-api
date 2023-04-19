"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.addCourse = void 0;
var courses_1 = require("../../models/courses");
var ErrorHandler_1 = require("../../utils/ErrorHandler");
var calculatePagination_1 = require("../../utils/calculatePagination");
var resultStatus_1 = require("../../utils/resultStatus");
var sanitize = require("mongo-sanitize");
function addCourse(data, res) {
    try {
        var courses = new courses_1.CoursesModel(sanitize(data));
        courses.save();
        (0, resultStatus_1.createResponse)(202, {
            url: data.video
        }, res);
    }
    catch (_a) {
        (0, ErrorHandler_1.responseErrorHandler)(ErrorHandler_1.ErrorCodeStatus.TIME_OUT_ERROR, 'please try later, or contact support', res);
    }
}
exports.addCourse = addCourse;
function getCourses(res, id, page) {
    return __awaiter(this, void 0, void 0, function () {
        var courses, pagination_1;
        return __generator(this, function (_a) {
            try {
                courses = new courses_1.CoursesModel();
                pagination_1 = {};
                courses.collection.countDocuments({ user_id: sanitize(id) })
                    .then(function (doc) {
                    pagination_1 = (0, calculatePagination_1.getPaginationByPageNumber)(doc, 50, 100, page);
                    getCoursesCollections(id, pagination_1.skip, pagination_1.limit, res, pagination_1.totalPages, pagination_1.currentPage, pagination_1.nenxtPage);
                }).catch(function (_err) {
                    return (0, ErrorHandler_1.responseErrorHandler)(ErrorHandler_1.ErrorCodeStatus.TIME_OUT_ERROR, 'internal server error', res);
                });
            }
            catch (error) {
                (0, ErrorHandler_1.responseErrorHandler)(ErrorHandler_1.ErrorCodeStatus.INTERNAL_SERVER_ERROR, 'internal server error', res);
            }
            return [2 /*return*/];
        });
    });
}
exports.getCourses = getCourses;
var getCoursesCollections = function (id, _skip, _limit, res, totalPages, currentPage, nextPage) {
    var courses = new courses_1.CoursesModel();
    var data = [];
    courses.collection.find(sanitize({ user_id: id })).forEach(function (value) {
        data.push(value);
    });
    setTimeout(function () {
        verifyCoursesData(data, res, totalPages, currentPage, nextPage);
    }, 3000);
};
var verifyCoursesData = function (data, res, totalPages, currentPage, nextPage) {
    if (!data) {
        (0, resultStatus_1.createResponse)(404, 'Not found', res);
    }
    else {
        (0, resultStatus_1.createResponse)(200, { data: data, totalPages: totalPages, currentPage: currentPage, nextPage: nextPage }, res);
    }
};
