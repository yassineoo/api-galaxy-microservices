"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.success_status_code_range = exports.HttpStatusCodes = void 0;
/**
 * Object to encapsulate HTTP status codes
 */
var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["OK"] = 200] = "OK";
    HttpStatusCodes[HttpStatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodes[HttpStatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCodes[HttpStatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCodes[HttpStatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodes[HttpStatusCodes["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCodes[HttpStatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCodes || (exports.HttpStatusCodes = HttpStatusCodes = {}));
;
exports.success_status_code_range = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
//200n, 201n, 202n, 203n, 204n, 205n, 206n, 207n, 208n, 226n, 
