import { Response } from "express";

class ResponseBuilder {
  public static send(
    res: Response, 
    status: number, 
    success: boolean, 
    message: string, 
    extraFields?: {}
  ) {
    res.status(status).json({
      success,
      message,
      ...(extraFields || {})
    });
  }
}

export default ResponseBuilder;
