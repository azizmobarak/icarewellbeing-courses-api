import { Request, Response } from "express";

// data shoud be sent in the following format
// { video: string|null
//   quize: [
//         question: sirng,
//         choices:[ id: string , answer: string]
//         correct : string  
// ]
// }

export function addQuizes(req: Request, res: Response){

}

