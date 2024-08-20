/**
 * Type definition for HTTP status codes
 */
// type HttpStatusCodes = {
// ok: number;
// badRequest: number;
// unauthorized: number;
// forbidden: number;
// notFound: number;
// conflict: number;
// serverError: number;
// };

/**
 * Object to encapsulate HTTP status codes
 */
export enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
};

export const success_status_code_range: (number)[] = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
//200n, 201n, 202n, 203n, 204n, 205n, 206n, 207n, 208n, 226n, 