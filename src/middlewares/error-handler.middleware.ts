import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BasicError from "../errors/basic.error";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const errMessage = err.message;
    const statusCode = err.statusCode;
    const defaultErrors = {
        badRequest: "Bad Request (path: npCommunicationId)",
        notFound: "Resource not found",
        summaryNotFound: "Cannot read properties of undefined (reading 'socialMetadata')"
    };


    if (err instanceof BasicError) {
        res.status(statusCode).json({
            "error": {
                "status": statusCode,
                "message": errMessage
            }
        })
    }
    else if (errMessage === defaultErrors.badRequest) {
        res.status(StatusCodes.BAD_REQUEST).json({
            "error": {
                "status": 400,
                "message": errMessage
            }
        })
    }
    else if (errMessage === defaultErrors.notFound || defaultErrors.summaryNotFound) {
        res.status(StatusCodes.NOT_FOUND).json({
            "error": {
                "status": 404,
                "message": errMessage
            }
        })
    }
    else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "error": {
                "status": 500,
                "message": "Something went wrong."
            }
        });
    }
};

export default errorHandler;