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
const listing_1 = __importDefault(require("./routes/listing"));
const admin_1 = __importDefault(require("./routes/admin"));
const callback_request_1 = __importDefault(require("./routes/callback-request"));
const auth_2 = require("./middleware/auth");
const database_1 = require("../database");
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
// 创建 MemoryStore 实例 - 增强配置用于临时解决方案
const memoryStore = (0, memorystore_1.default)(express_session_1.default);
// 根据环境配置允许的域名
const getAllowedOrigins = () => {
    const origins = {
        production: [
            'https://business-board.vercel.app', // 生产环境主域名
            'https://business-board-git-main-xinyis-projects-6c0795d6.vercel.app', // 生产环境 git 域名
            /https:\/\/business-board-git-main-.*\.vercel\.app/, // 生产环境的其他 main 分支域名
            /https:\/\/business-board-.*-xinyis-projects-6c0795d6\.vercel\.app/, // 用户特定的生产域名
            'https://bribizsales.com', // 自定义域名
            'https://www.bribizsales.com', // 自定义域名 www
            'https://californiabizsales.com', // 新的自定义域名
            'https://www.californiabizsales.com' // 新的自定义域名 www
        ],
        preview: [
            'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app', // 你的具体预览环境域名
            /https:\/\/business-board-git-dev-.*\.vercel\.app/, // 预览环境的 dev 分支域名
            /https:\/\/business-board-.*-xinyis-projects-6c0795d6\.vercel\.app/, // 用户特定的预览域名
            /https:\/\/business-board-.*\.vercel\.app/, // 所有 business-board 相关的 Vercel 域名
            'https://bribizsales.com', // 自定义域名也允许在预览环境
            'https://www.bribizsales.com', // 自定义域名 www 也允许在预览环境
            'https://californiabizsales.com', // 新的自定义域名也允许在预览环境
            'https://www.californiabizsales.com' // 新的自定义域名 www 也允许在预览环境
        ],
        development: [
            'http://localhost:5174',
            'http://localhost:5173'
        ]
    };
    // 检测环境：根据Render和Vercel的部署配置
    let env = 'development'; // 默认为开发环境
    // 首先检查 NODE_ENV 环境变量
    if (process.env.NODE_ENV === 'preview') {
        env = 'preview';
    }
    else if (process.env.NODE_ENV === 'production') {
        env = 'production';
    }
    else if (process.env.VERCEL_ENV === 'preview') {
        env = 'preview';
    }
    else if (process.env.VERCEL_ENV === 'production') {
        env = 'production';
    }
    else if (process.env.NODE_ENV === 'development') {
        env = 'development';
    }
    // 在Render上，我们通过检查是否有特定的环境变量来确定是preview还是production
    // 根据项目配置，preview环境部署在business-board.onrender.com
    const isRenderDeployment = process.env.RENDER === 'true' || process.env.RENDER_SERVICE_ID;
    if (isRenderDeployment) {
        // 如果没有明确的环境设置，默认为preview（因为主要的部署是preview环境）
        if (env === 'development') {
            env = 'preview';
        }
    }
    console.log('Environment detection:', {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        RENDER: process.env.RENDER,
        RENDER_SERVICE_ID: process.env.RENDER_SERVICE_ID,
        finalEnv: env
    });
    if (!(env in origins)) {
        console.warn('Unknown environment:', env, 'falling back to preview for safety');
        return [...origins.development, ...origins.preview]; // 返回更宽松的配置
    }
    console.log('Available origins for environment', env, ':', origins[env]);
    return origins[env];
};
// 配置 CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins();
        const hostname = process.env.HOST;
        // CORS configuration
        console.log('=== CORS Request Debug ===');
        console.log('Incoming request origin:', origin);
        console.log('Current environment:', process.env.NODE_ENV);
        console.log('Current hostname:', hostname);
        console.log('RENDER environment:', process.env.RENDER);
        console.log('Available origins for this environment:', allowedOrigins);
        // 允许没有 origin 的请求 (比如移动app或者一些工具)
        if (!origin) {
            console.log('No origin, allowing request');
            callback(null, true);
            return;
        }
        // 临时：明确允许当前的Vercel preview域名来解决CORS问题
        const explicitAllowedDomains = [
            'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app',
            'https://business-board.vercel.app',
            'https://bribizsales.com', // 自定义域名
            'https://www.bribizsales.com', // 自定义域名 www
            'https://californiabizsales.com', // 新的自定义域名
            'https://www.californiabizsales.com', // 新的自定义域名 www
            'http://localhost:5173',
            'http://localhost:5174'
        ];
        if (explicitAllowedDomains.includes(origin)) {
            console.log('Origin explicitly allowed:', origin);
            callback(null, true);
            return;
        }
        // 检查 origin 是否在允许列表中 (支持字符串和正则表达式)
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return allowedOrigin === origin;
            }
            else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        if (isAllowed) {
            console.log('Origin allowed by configured rules:', origin);
            callback(null, true);
        }
        else {
            console.error('CORS Error: Origin not allowed:', origin);
            console.error('Allowed origins:', allowedOrigins);
            console.error('Explicit allowed domains:', explicitAllowedDomains);
            callback(new Error('Not allowed by CORS'), false);
        }
        console.log('=== End CORS Request Debug ===');
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'X-Browser-Mode',
        'X-Session-Token'
    ],
    exposedHeaders: [
        'X-Session-Token'
    ]
}));
app.use(express_1.default.json());
// 生产环境优化的session配置
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'preview';
const isVercelDeploy = process.env.VERCEL === '1';
const sessionSecret = process.env.SESSION_SECRET || crypto_1.default.randomBytes(64).toString('hex');
// 检测是否需要跨域设置 - preview和production都需要跨域设置
const needsCrossDomainSettings = isProduction || isPreview;
// 配置 session - preview和production都使用相同的跨域设置
const sessionConfig = {
    store: new memoryStore({
        checkPeriod: 86400000, // 每24小时清理过期会话  
        max: 10000, // 最大session数量（减少以避免内存问题）
        ttl: 7 * 24 * 60 * 60 * 1000, // 7天过期时间
        dispose: function (key, val) {
            if (!needsCrossDomainSettings) {
                console.log('Session disposed:', key);
            }
        },
        // 增强production和preview环境的session存储
        stale: true, // 允许返回过期的session
        noDisposeOnSet: true // 设置时不自动dispose
    }),
    name: 'business.board.sid',
    secret: sessionSecret,
    resave: true, // 强制保存session
    saveUninitialized: false, // 不保存未初始化的session以减少内存使用
    rolling: true, // 每次请求时重置过期时间
    proxy: true, // 在所有环境信任代理
    cookie: {
        secure: needsCrossDomainSettings, // preview和production环境都使用secure cookies
        httpOnly: true,
        sameSite: needsCrossDomainSettings ? 'none' : 'lax', // preview和production环境都需要'none'来支持跨域
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        domain: undefined // 不设置domain以确保在所有子域名下都能工作
    },
    // 增强session处理
    unset: 'destroy', // 明确指定unset行为
    genid: function () {
        // 自定义session ID生成以确保唯一性
        return crypto_1.default.randomBytes(24).toString('hex');
    }
};
console.log('Session configuration:', {
    env: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    isProduction,
    isPreview,
    isVercelDeploy,
    needsCrossDomainSettings,
    secret: sessionSecret ? '[SET]' : '[DEFAULT]',
    secure: sessionConfig.cookie?.secure,
    sameSite: sessionConfig.cookie?.sameSite,
    domain: sessionConfig.cookie?.domain,
    maxAge: sessionConfig.cookie?.maxAge,
    storeType: 'MemoryStore',
    maxSessions: 10000,
    note: `Using ${needsCrossDomainSettings ? 'secure cross-domain' : 'relaxed'} settings for ${isProduction ? 'production' : isPreview ? 'preview' : 'development'} environment`
});
// 确保在所有路由之前初始化 session
app.use((0, express_session_1.default)(sessionConfig));
// 添加production和preview环境的session调试中间件
app.use((req, res, next) => {
    // 在production和preview环境都记录关键session信息以诊断问题
    if ((isProduction || isPreview) && (req.path.includes('/broker/dashboard') || req.path.includes('/buyer/nda'))) {
        console.log('=== Session Debug ===');
        console.log('Request details:', {
            method: req.method,
            path: req.path,
            origin: req.headers.origin,
            sessionID: req.sessionID,
            hasSession: !!req.session,
            hasSessionUser: !!req.session?.user,
            sessionUserId: req.session?.user?.id,
            cookieHeader: req.headers.cookie ? 'present' : 'missing',
            hasXSessionToken: !!req.headers['x-session-token'],
            userAgent: req.headers['user-agent']?.substring(0, 50),
            environment: isProduction ? 'production' : isPreview ? 'preview' : 'development'
        });
        // 如果session存在但没有user，可能是store问题
        if (req.session && !req.session.user) {
            console.log('⚠️ Session exists but no user found - possible store issue');
        }
        console.log('=== End Session Debug ===');
    }
    next();
});
// 添加跨域credentials支持中间件
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // 设置CORS headers以支持credentials
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-Browser-Mode, X-Session-Token');
    res.header('Access-Control-Expose-Headers', 'X-Session-Token');
    // 处理preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});
// 添加生产环境session恢复中间件
app.use((req, res, next) => {
    // 检查是否是无痕模式的请求
    const userAgent = req.headers['user-agent'] || '';
    const isIncognito = req.headers['sec-fetch-dest'] === 'document' &&
        req.headers['sec-fetch-mode'] === 'navigate' &&
        !req.headers['referer'];
    // 为无痕模式设置额外的 CORS 头
    if (isIncognito || isVercelDeploy) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Vary', 'Origin');
    }
    // 添加调试信息
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_SESSION) {
        console.log('Request info:', {
            incognito: isIncognito,
            hasSession: !!req.session?.user?.id,
            sessionID: req.sessionID,
            cookies: req.headers.cookie ? 'present' : 'missing',
            origin: req.headers.origin,
            env: process.env.NODE_ENV,
            hasSessionToken: !!req.headers['x-session-token']
        });
    }
    next();
});
// 添加安全相关的响应头
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
// 从 session 恢复用户信息
app.use(auth_2.restoreUser);
// 添加请求日志中间件
app.use((req, res, next) => {
    // 只在开发环境或明确启用时显示详细日志
    if (process.env.DEBUG_SESSION && process.env.NODE_ENV === 'development') {
        const typedReq = req; // 使用类型断言避免TypeScript错误
        console.log('=== Session Debug Info ===');
        console.log('Session ID:', req.sessionID);
        console.log('Session User:', req.session?.user ? {
            id: req.session.user.id,
            role: req.session.user.role
        } : null);
        console.log('Request User:', typedReq.user ? {
            id: typedReq.user.id,
            role: typedReq.user.role
        } : null);
        console.log('=== End Session Debug Info ===');
    }
    next();
});
// 注册路由
app.use('/api/auth', auth_1.default);
app.use('/api/broker/listings', listing_1.default);
app.use('/api/broker', broker_1.default);
app.use('/api/agent', agent_1.default);
app.use('/api/buyer', buyer_1.default);
app.use('/api/seller', seller_1.default);
app.use('/api/users', users_1.default);
app.use('/api/messages', messages_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/callback-request', callback_request_1.default);
// 健康检查
app.get('/health', async (req, res) => {
    try {
        const health = await (0, database_1.checkDatabaseHealth)();
        res.json({ status: 'ok', environment: process.env.NODE_ENV, database: health });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            status: 'error',
            environment: process.env.NODE_ENV,
            message: errorMessage
        });
    }
});
// 临时调试endpoint
app.get('/debug/session', (req, res) => {
    const typedReq = req;
    res.json({
        sessionID: typedReq.sessionID,
        hasSession: !!typedReq.session,
        sessionUser: typedReq.session?.user || null,
        user: typedReq.user || null,
        cookies: req.headers.cookie,
        headers: {
            origin: req.headers.origin,
            userAgent: req.headers['user-agent'],
            xSessionToken: req.headers['x-session-token']
        },
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        sessionConfig: {
            cookieName: 'business.board.sid',
            secure: sessionConfig.cookie?.secure,
            sameSite: sessionConfig.cookie?.sameSite,
            httpOnly: sessionConfig.cookie?.httpOnly,
            maxAge: sessionConfig.cookie?.maxAge
        },
        timestamp: new Date().toISOString()
    });
});
// 添加session验证端点
app.get('/api/auth/verify-session', (req, res) => {
    const typedReq = req;
    console.log('=== Session Verification Debug ===');
    console.log('Session ID:', typedReq.sessionID);
    console.log('Has session user:', !!typedReq.session?.user);
    console.log('Session user data:', typedReq.session?.user);
    console.log('Request user:', typedReq.user);
    console.log('Cookies:', req.headers.cookie);
    console.log('Origin:', req.headers.origin);
    if (typedReq.session?.user || typedReq.user) {
        res.json({
            authenticated: true,
            user: typedReq.session?.user || typedReq.user,
            sessionId: typedReq.sessionID
        });
    }
    else {
        res.status(401).json({
            authenticated: false,
            message: 'No valid session found'
        });
    }
});
exports.default = app;
