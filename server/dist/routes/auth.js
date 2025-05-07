"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const express_1 = __importDefault(require("express"));
const prisma = new prisma_1.PrismaClient();
const router = express_1.default.Router();
const loginHandler = (async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const redirect = `/dashboard/${user.role.toLowerCase()}`;
    res.json({ message: 'Login successful', role: user.role, redirect });
});
router.post('/login', loginHandler);
exports.default = router;
