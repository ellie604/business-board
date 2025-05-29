"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// server/database.mts
// import { PrismaClient } from './generated/prisma/client.js';
// export const prisma = new PrismaClient();
// database.mts
const prisma_production_1 = require("./generated/prisma-production");
const prisma_preview_1 = require("./generated/prisma-preview");
// 默认使用 preview 数据库，除非明确指定使用 production
const prisma = (process.env.NODE_ENV === 'production'
    ? new prisma_production_1.PrismaClient()
    : new prisma_preview_1.PrismaClient());
exports.prisma = prisma;
