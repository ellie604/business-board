"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.authenticateSeller = exports.authenticateBuyer = exports.authenticateBroker = exports.authenticateAgent = exports.requireAuth = exports.restoreUser = void 0;
const database_1 = require("../../database");
const prisma = (0, database_1.getPrisma)();
// 从 session 恢复用户信息的中间件
const restoreUser = async (req, _res, next) => {
    const typedReq = req;
    // 仅在开发环境记录详细日志
    if (process.env.NODE_ENV !== 'production') {
        console.log('=== Session Restore Debug ===');
        console.log('Request headers:', {
            cookie: req.headers.cookie,
            origin: req.headers.origin,
            referer: req.headers.referer,
            authorization: req.headers.authorization,
            'x-session-token': req.headers['x-session-token'],
            'x-browser-mode': req.headers['x-browser-mode'],
            'user-agent': req.headers['user-agent']
        });
        console.log('Session details:', {
            id: typedReq.sessionID,
            cookie: typedReq.session?.cookie,
            user: typedReq.session?.user ? {
                id: typedReq.session.user.id,
                role: typedReq.session.user.role
            } : null
        });
    }
    // 尝试从多个来源恢复用户会话
    if (!typedReq.session?.user) {
        // 1. 尝试从 Authorization header 恢复
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                // 这里应该验证 token 并恢复会话
                console.log('Attempting to restore session from Authorization header');
                // TODO: 实现 token 验证逻辑
            }
            catch (error) {
                console.error('Failed to restore session from token:', error);
            }
        }
        // 2. 尝试从自定义 header 恢复 - 实现实际的恢复逻辑
        const sessionToken = req.headers['x-session-token'];
        if (sessionToken) {
            try {
                console.log('Attempting to restore session from x-session-token:', sessionToken);
                // 从数据库查找用户信息
                const user = await (0, database_1.getPrisma)().user.findUnique({
                    where: { id: sessionToken },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        managerId: true
                    }
                });
                if (user) {
                    console.log('User found from x-session-token:', {
                        id: user.id,
                        role: user.role,
                        email: user.email,
                        managerId: user.managerId
                    });
                    // 恢复session
                    if (typedReq.session) {
                        typedReq.session.user = {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            managerId: user.managerId
                        };
                        // 设置用户到请求对象
                        typedReq.user = {
                            ...user,
                            id: user.id.toString()
                        };
                        console.log('Session restored from x-session-token successfully');
                    }
                }
                else {
                    console.log('No user found for x-session-token:', sessionToken);
                }
            }
            catch (error) {
                console.error('Failed to restore session from x-session-token:', error);
            }
        }
    }
    if (typedReq.session?.user) {
        typedReq.user = {
            ...typedReq.session.user,
            id: typedReq.session.user.id.toString()
        };
        // 确保会话持久化
        if (!typedReq.session.cookie.maxAge) {
            typedReq.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
        }
        // 在无痕模式下特殊处理
        const isIncognito = !req.headers.referer && req.headers['sec-fetch-dest'] === 'document';
        if (isIncognito) {
            typedReq.session.cookie.sameSite = 'none';
            typedReq.session.cookie.secure = true;
            console.log('Adjusted cookie settings for incognito mode');
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log('User restored successfully:', {
                id: typedReq.user.id,
                role: typedReq.user.role,
                isIncognito
            });
        }
    }
    else if (process.env.NODE_ENV !== 'production') {
        console.log('No user found in session');
    }
    if (process.env.NODE_ENV !== 'production') {
        console.log('=== End Session Restore Debug ===');
    }
    next();
};
exports.restoreUser = restoreUser;
const requireAuth = (req, res, next) => {
    const typedReq = req;
    console.log('Checking auth - Session:', typedReq.session);
    console.log('Checking auth - User:', typedReq.user);
    if (!typedReq.user) {
        console.log('No user found in request');
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
const authenticateAgent = (req, res, next) => {
    const typedReq = req;
    console.log('Authenticating agent - Session:', {
        sessionID: typedReq.sessionID,
        user: typedReq.session.user,
        cookies: typedReq.headers.cookie
    });
    console.log('Authenticating agent - User:', {
        user: typedReq.user,
        type_of_id: typedReq.user?.id ? typeof typedReq.user.id : 'undefined'
    });
    if (!typedReq.user) {
        console.log('No user found in request');
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (typedReq.user.role !== 'AGENT') {
        console.log('User is not an agent. Role:', typedReq.user.role);
        res.status(403).json({ message: 'Access denied. Agent role required.' });
        return;
    }
    next();
};
exports.authenticateAgent = authenticateAgent;
const authenticateBroker = (req, res, next) => {
    const typedReq = req;
    // 仅在开发环境记录详细日志
    if (process.env.NODE_ENV !== 'production') {
        console.log('=== Broker Authentication Debug ===');
        console.log('Request details:', {
            method: req.method,
            path: req.path,
            headers: {
                cookie: req.headers.cookie,
                origin: req.headers.origin,
                referer: req.headers.referer
            }
        });
        console.log('Session details:', {
            id: typedReq.sessionID,
            cookie: typedReq.session?.cookie,
            user: typedReq.session?.user ? {
                id: typedReq.session.user.id,
                role: typedReq.session.user.role
            } : null
        });
    }
    if (!typedReq.user) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Authentication failed: No user in request');
        }
        res.status(401).json({
            message: 'Authentication required'
        });
        return;
    }
    if (typedReq.user.role !== 'BROKER') {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Authorization failed: Invalid role:', typedReq.user.role);
        }
        res.status(403).json({
            message: 'Access denied. Broker role required.'
        });
        return;
    }
    if (process.env.NODE_ENV !== 'production') {
        console.log('Authentication successful:', {
            userId: typedReq.user.id,
            role: typedReq.user.role
        });
        console.log('=== End Broker Authentication Debug ===');
    }
    next();
};
exports.authenticateBroker = authenticateBroker;
// 买家认证中间件
const authenticateBuyer = (req, res, next) => {
    const typedReq = req;
    if (typedReq.user?.role !== 'BUYER') {
        res.status(403).json({ message: 'Access denied. Buyer role required.' });
        return;
    }
    next();
};
exports.authenticateBuyer = authenticateBuyer;
const authenticateSeller = (req, res, next) => {
    const typedReq = req;
    if (typedReq.user?.role !== 'SELLER') {
        res.status(403).json({ message: 'Access denied. Seller role required.' });
        return;
    }
    next();
};
exports.authenticateSeller = authenticateSeller;
const authenticateUser = (req, res, next) => {
    const typedReq = req;
    console.log('Authenticating user - Session:', {
        sessionID: typedReq.sessionID,
        sessionUser: typedReq.session?.user,
        cookies: typedReq.headers.cookie
    });
    if (!typedReq.session?.user) {
        console.log('No user found in session');
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (!typedReq.user) {
        typedReq.user = {
            ...typedReq.session.user,
            id: typedReq.session.user.id.toString() // 确保 ID 是字符串
        };
    }
    next();
};
exports.authenticateUser = authenticateUser;
