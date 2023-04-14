export const createResponse = (status: number, data: string | any, res: any) => {
   res.status(status).send({
       status,
       data,
   })
}