export const createResponse = (status: number, data: string | any, res: any) => {
   res.send({
       status,
       data,
   })
}