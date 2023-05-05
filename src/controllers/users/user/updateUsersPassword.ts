import { Request, Response } from "express"
import { UserModel } from "../../../models/users";
import { decodeToken } from "../../../services/parseToken";
import { getUserID } from "../../../utils/userUtils";
import sanitize from "mongo-sanitize";
import { ObjectId } from "mongodb";
import { createResponse } from "../../../utils/resultStatus";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt')
const saltRounds = 22

export async function updateUserPassword(req: Request, res: Response){
    console.log(req.cookies.access_token)
   await decodeToken(req.cookies.access_token,res).then(async value=>{
        const id = getUserID(value);
        const users = new UserModel();
       const password = req.body.password;
        console.log(id);

         await bcrypt.genSalt(saltRounds, async function (err: any, salt: string) {
        if (err) return null
        return  await bcrypt.hash(
            password,
            salt,
            function (err: any, hash: string) {
                if (err) return null
        return  users.collection.findOneAndUpdate({_id: sanitize(new ObjectId(id))},{'$set':{
                password: hash,
             }}).then(doc=>{
                console.log(doc);
                if(doc){
                    createResponse(200, 'updated', res);
                }
             }).catch(err=>{
                console.log(err);
                createResponse(401, '', res);
             })
            }
        )
    })
})
}