"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidator = exports.durationValidator = void 0;
const zod_1 = require("zod");
exports.durationValidator = zod_1.z.enum([
    "1h",
    "3h",
    "6h",
    "12h",
    "24h",
    "7d",
    "30d",
    "90d",
    // "6m",
    "1y"
]);
exports.idValidator = zod_1.z.coerce.bigint();
// export const timeFilter = [
//     { value: "7d", label: "last 7 days" },
//     { value: "30d", label: "last 30 days" },
//     { value: "90d", label: "last 90 days" },
//     { value: "1h", label: "last hour" },
//     { value: "3h", label: "last 3 hours" },
//     { value: "6h", label: "last 6 hours" },
//     { value: "12h", label: "last 12 hours" },
//     { value: "24h", label: "last 24 hours" },
//   ];
