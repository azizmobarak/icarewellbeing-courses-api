const multer = require('multer')
const storage = () =>
    multer.diskStorage({
        destination: function (_req: any, _file: any, cb: any) {
            cb(null, 'videos')
        },
        filename: function (req: any, file: any, cb: any) {
            cb(null, req.body.name + file.originalname)
        },
    })

export const uploadVideo = multer({ dest: 'videos/', storage })
