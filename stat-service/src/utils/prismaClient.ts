import { PrismaClient } from "@prisma/client";

export const prismaClientSingleton = new PrismaClient();