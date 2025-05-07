"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
    'https://business-board-lsaip54ym-xinyis-projects-6c0795d6.vercel.app',
    'https://business-board.vercel.app'
];
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use(body_parser_1.default.json());
app.use('/api', auth_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
