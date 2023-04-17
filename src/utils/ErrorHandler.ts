export enum ErrorCodeStatus {
 FORBIDDEN = 403,
 NOT_FOUND = 404,
 BAD_REQUEST = 400,
 UNAUTHRIZED = 401,
 METHOD_NOT_ALLOWED = 405,
 NOTACCEPTABLE = 406,
 INTERNAL_SERVER_ERROR = 500,
 SERVICE_UNAVAILABLE = 503,
 TIME_OUT_ERROR = 599,
}

export const responseErrorHandler = (status: ErrorCodeStatus, data: string | any, res: any) => {
   res.status(status).send({
       status,
       data,
   })
}