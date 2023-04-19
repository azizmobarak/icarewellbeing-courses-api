"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
var multer = require("multer");
var storage = function () { return multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'videos');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name + file.originalname);
    },
}); };
exports.uploadVideo = multer({ dest: "videos/", storage: storage });
