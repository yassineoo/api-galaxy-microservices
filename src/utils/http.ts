/**
 * Type definition for HTTP status codes
 */
type HttpStatusCodes = {
    ok: number;
    badRequest: number;
    unauthorized: number;
    forbidden: number;
    notFound: number;
    conflict: number;
    serverError: number;
  };
  
  /**
   * Object to encapsulate HTTP status codes
   */
  const statusCodes: HttpStatusCodes = {
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    serverError: 500,
  };
  
  export { statusCodes };
  