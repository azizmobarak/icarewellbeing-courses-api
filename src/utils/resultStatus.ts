import { Response } from "express"

export const createResponse = (status: number, data:  any, res: Response) => {
   res.status(status).send({
       status,
       data,
   })
}