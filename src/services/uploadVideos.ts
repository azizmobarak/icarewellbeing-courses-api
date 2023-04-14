const fs = require('fs');
// const multer = require("multer");
// const upload = multer({ dest: "videos/" });

// export function uploadVideo () {

// }

export function deleteVideoLocally (fileName: string){
  try {
  fs.unlinkSync(fileName);
} catch (error) {
  console.log(error);
}

}