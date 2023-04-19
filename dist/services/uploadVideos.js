"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoLocally = void 0;
var fs = require('fs');
// const multer = require("multer");
// const upload = multer({ dest: "videos/" });
// export function uploadVideo () {
// }
function deleteVideoLocally(fileName) {
    try {
        fs.unlinkSync(fileName);
    }
    catch (error) {
        console.log(error);
    }
}
exports.deleteVideoLocally = deleteVideoLocally;
