"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClientSingleton = void 0;
const client_1 = require("@prisma/client");
exports.prismaClientSingleton = new client_1.PrismaClient();
