"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_preview_1 = require("./generated/prisma-preview");
const prisma = new prisma_preview_1.PrismaClient();
async function main() { const users = await prisma.user.findMany(); console.log(JSON.stringify(users, null, 2)); }
main().finally(() => prisma.$disconnect());
