"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const memorystore_1 = __importDefault(require("memorystore"));
const auth_1 = __importDefault(require("./routes/auth"));
const broker_1 = __importDefault(require("./routes/broker"));
const agent_1 = __importDefault(require("./routes/agent"));
const buyer_1 = __importDefault(require("./routes/buyer"));
const seller_1 = __importDefault(require("./routes/seller"));
const users_1 = __importDefault(require("./routes/users"));
const messages_1 = __importDefault(require("./routes/messages"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
// 创建 MemoryStore 实例
const memoryStore = (0, memorystore_1.default)(express_session_1.default);
// 根据环境配置允许的域名
const getAllowedOrigins = () => {
    const origins = {
        production: [
            'https://business-board.vercel.app', // 生产环境主域名
            /https:\/\/business-board-git-main-.*\.vercel\.app/ // 生产环境的其他 Vercel 域名
        ],
        preview: [
            'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app', // 你的具体预览环境域名
            /https:\/\/business-board-git-dev-.*\.vercel\.app/, // 预览环境的 Vercel 域名
            /https:\/\/business-board-.*\.vercel\.app/, // 其他 Vercel 预览域名
            'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app' // 确保完全匹配
        ],
        development: [
            'http://localhost:5174',
            'http://localhost:5173'
        ]
    };
    const env = process.env.NODE_ENV || 'development';
    console.log('Current environment:', env);
    console.log('Current hostname:', process.env.HOST);
    if (!(env in origins)) {
        console.warn('Unknown environment:', env, 'falling back to development');
        return origins.development;
    }
    console.log('Available origins for this environment:', origins[env]);
    return origins[env];
};
// 配置 CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins();
        console.log('=== CORS Debug Info ===');
        console.log('Incoming request origin:', origin);
        console.log('Current NODE_ENV:', process.env.NODE_ENV);
        console.log('Allowed origins:', allowedOrigins);
        // 允许没有 origin 的请求（比如同源请求）
        if (!origin) {
            console.log('No origin provided, allowing request');
            return callback(null, true);
        }
        // 检查是否匹配允许的域名
        const isAllowed = Array.isArray(allowedOrigins)
            ? allowedOrigins.some(allowed => {
                const matches = allowed instanceof RegExp
                    ? allowed.test(origin)
                    : allowed === origin;
                console.log(`Checking origin ${origin} against ${allowed}:`, matches);
                return matches;
            })
            : allowedOrigins === origin;
        if (isAllowed) {
            console.log('Origin allowed:', origin);
            return callback(null, origin);
        }
        console.log('Origin not allowed:', origin);
        console.log('=== End CORS Debug Info ===');
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express_1.default.json());
// 配置 session
const sessionConfig = {
    store: new memoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    name: 'business.board.sid',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
    }
};
console.log('Session configuration:', {
    env: process.env.NODE_ENV,
    secret: process.env.SESSION_SECRET ? '[SET]' : '[DEFAULT]',
    secure: sessionConfig.cookie?.secure,
    sameSite: sessionConfig.cookie?.sameSite
});
// 在开发环境下禁用 secure cookie
if (process.env.NODE_ENV === 'development') {
    sessionConfig.cookie.secure = false;
}
// 确保在所有路由之前初始化 session
app.use((0, express_session_1.default)(sessionConfig));
// 从 session 恢复用户信息
app.use(auth_2.restoreUser);
// 添加调试中间件
app.use((req, res, next) => {
    console.log('=== Session Debug Info ===');
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Cookie:', req.headers.cookie);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('=== End Session Debug Info ===');
    next();
});
// 添加路由调试中间件
app.use((req, res, next) => {
    console.log('=== Request Debug Info ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=== End Request Debug Info ===');
    next();
});
// 注册路由
app.use('/api/auth', auth_1.default);
app.use('/api/broker', broker_1.default);
app.use('/api/agent', agent_1.default);
app.use('/api/buyer', buyer_1.default);
app.use('/api/seller', seller_1.default);
app.use('/api/users', users_1.default);
app.use('/api/messages', messages_1.default);
// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV });
});
exports.default = app;
