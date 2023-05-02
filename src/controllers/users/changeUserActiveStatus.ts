import { Response, Request } from 'express'
import { UserModel } from '../../models/users'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { createResponse } from '../../utils/resultStatus'

export async function changeUserStatus(req: Request, res: Response) {
    const user = new UserModel()
   await user.collection.findOne({_id: sanitize(new ObjectId(req.body.id))}).then(value=>{
       if(value){
     user.collection
        .updateOne({ _id: sanitize(new ObjectId(req.body.id)) },{'$set':{active: !value.active}})
        .then((doc) => {
            if (doc) {
                const status = !value.active ? 'Active' : 'Not Active'
                createResponse(200, 'user now is ' + status, res)
            } else {
                createResponse(
                    204,
                    [],
                    res
                )
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(
                400,
                'an error is launched please contact support or try later',
                res
            )
        })
       }
   })
}
