const fs = require('fs')
// const multer = require("multer");
// const upload = multer({ dest: "videos/" });

// export function uploadVideo () {

// }

export function deleteVideoLocally(fileName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(fileName)
            return resolve(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
}
