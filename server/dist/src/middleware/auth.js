"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.authenticateSeller = exports.authenticateBuyer = exports.authenticateBroker = exports.authenticateAgent = exports.requireAuth = exports.restoreUser = void 0;
const database_1 = require("../../database");
const prisma = (0, database_1.getPrisma)();
// 从 session 恢复用户信息的中间件
const restoreUser = async (req, _res, next) => {
    const typedReq = req;
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'preview';
    // 增强的调试信息
    if (!isProduction) {
        console.log('=== User Restore Debug ===');
        console.log('Request details:', {
            method: req.method,
            path: req.path,
            origin: req.headers.origin,
            userAgent: req.headers['user-agent']?.substring(0, 50),
            sessionID: typedReq.sessionID?.substring(0, 8) + '...',
            hasSession: !!typedReq.session,
            hasSessionUser: !!typedReq.session?.user,
            sessionUserId: typedReq.session?.user?.id?.substring(0, 8) + '...' || 'none',
            hasXSessionToken: !!req.headers['x-session-token'],
            cookies: req.headers.cookie ? 'present' : 'missing'
        });
    }
    // 优先从session恢复用户
    if (typedReq.session?.user?.id) {
        try {
            typedReq.user = {
                ...typedReq.session.user,
                id: typedReq.session.user.id.toString()
            };
            // 确保会话持久化和延长过期时间
            typedReq.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
            // 强制保存session以确保持久化
            if (typedReq.session.save) {
                typedReq.session.save((err) => {
                    if (err && !isProduction) {
                        console.error('Failed to save session after user restore:', err);
                    }
                });
            }
            if (!isProduction) {
                console.log('✅ User restored from session:', {
                    id: typedReq.user.id.substring(0, 8) + '...',
                    role: typedReq.user.role,
                    email: typedReq.user.email
                });
                console.log('=== End User Restore Debug ===');
            }
            return next();
        }
        catch (error) {
            console.error('Error restoring user from session:', error);
        }
    }
    // 备用：尝试从header恢复（为了向后兼容和production环境的可靠性）
    const sessionToken = req.headers['x-session-token'];
    if (sessionToken) {
        try {
            if (!isProduction) {
                console.log('🔄 Attempting restore from x-session-token:', sessionToken.substring(0, 8) + '...');
            }
            // 从数据库查找用户信息
            const user = await (0, database_1.getPrisma)().user.findUnique({
                where: { id: sessionToken },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    managerId: true,
                    isActive: true
                }
            });
            if (user && user.isActive) {
                if (!isProduction) {
                    console.log('✅ User found from x-session-token:', {
                        id: user.id.substring(0, 8) + '...',
                        role: user.role,
                        email: user.email
                    });
                }
                // 设置用户到请求对象
                typedReq.user = {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name || undefined,
                    role: user.role,
                    managerId: user.managerId || undefined
                };
                // 同时更新session，重要的是要在production环境中也保存session
                if (typedReq.session) {
                    typedReq.session.user = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        managerId: user.managerId
                    };
                    // 强制保存session，特别是在production环境中
                    typedReq.session.save((err) => {
                        if (err) {
                            console.error('Failed to save session from token restore:', err);
                        }
                        else if (!isProduction) {
                            console.log('✅ Session saved after token restore');
                        }
                        else {
                            // 在production环境中也记录成功信息
                            console.log('✅ Production session saved from token restore');
                        }
                    });
                }
                if (!isProduction) {
                    console.log('=== End User Restore Debug ===');
                }
                return next();
            }
            else {
                if (!isProduction) {
                    console.log('❌ User not found or inactive for token:', sessionToken.substring(0, 8) + '...');
                }
            }
        }
        catch (error) {
            console.error('❌ Failed to restore user from x-session-token:', error);
        }
    }
    if (!isProduction) {
        console.log('❌ No user restored from any source');
        console.log('=== End User Restore Debug ===');
    }
    next();
};
exports.restoreUser = restoreUser;
const requireAuth = (req, res, next) => {
    const typedReq = req;
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    // 记录认证尝试
    if (!isProduction) {
        console.log('=== Authentication Check ===');
        console.log('Auth details:', {
            path: req.path,
            method: req.method,
            hasUser: !!typedReq.user,
            hasSession: !!typedReq.session?.user,
            sessionID: typedReq.sessionID?.substring(0, 8) + '...',
            userFromReq: typedReq.user ? {
                id: typedReq.user.id.substring(0, 8) + '...',
                role: typedReq.user.role,
                email: typedReq.user.email
            } : null,
            userFromSession: typedReq.session?.user ? {
                id: typedReq.session.user.id.substring(0, 8) + '...',
                role: typedReq.session.user.role,
                email: typedReq.session.user.email
            } : null
        });
    }
    if (!typedReq.user) {
        // 在所有环境记录认证失败
        console.log('❌ Authentication failed:', {
            path: req.path,
            method: req.method,
            sessionId: typedReq.sessionID?.substring(0, 8) + '...',
            hasSession: !!typedReq.session,
            hasSessionUser: !!typedReq.session?.user,
            userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
            origin: req.headers.origin,
            hasCookies: !!req.headers.cookie,
            hasXSessionToken: !!req.headers['x-session-token']
        });
        res.status(401).json({
            message: 'Authentication required',
            error: 'AUTHENTICATION_REQUIRED',
            timestamp: new Date().toISOString()
        });
        return;
    }
    if (!isProduction) {
        console.log('✅ Authentication successful:', {
            id: typedReq.user.id.substring(0, 8) + '...',
            role: typedReq.user.role,
            email: typedReq.user.email
        });
        console.log('=== End Authentication Check ===');
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
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    // 在所有环境下记录基本信息
    console.log('=== Broker Authentication ===');
    console.log('Request details:', {
        method: req.method,
        path: req.path,
        origin: req.headers.origin,
        hasSession: !!typedReq.session?.user,
        sessionUser: typedReq.session?.user ? {
            id: typedReq.session.user.id.substring(0, 8) + '...',
            role: typedReq.session.user.role
        } : null,
        hasReqUser: !!typedReq.user,
        reqUser: typedReq.user ? {
            id: typedReq.user.id.substring(0, 8) + '...',
            role: typedReq.user.role
        } : null
    });
    // 仅在开发环境记录详细信息
    if (!isProduction) {
        console.log('Detailed session info:', {
            sessionId: typedReq.sessionID,
            cookie: typedReq.session?.cookie,
            headers: {
                cookie: req.headers.cookie,
                referer: req.headers.referer
            }
        });
    }
    // Production环境的特殊处理：如果没有user但有session，尝试从session恢复
    if (!typedReq.user && typedReq.session?.user && isProduction) {
        console.log('🔄 Production fallback: attempting to restore user from session');
        try {
            typedReq.user = {
                id: typedReq.session.user.id.toString(),
                email: typedReq.session.user.email,
                name: typedReq.session.user.name,
                role: typedReq.session.user.role,
                managerId: typedReq.session.user.managerId
            };
            console.log('✅ Production fallback successful: user restored from session');
        }
        catch (error) {
            console.error('❌ Production fallback failed:', error);
        }
    }
    if (!typedReq.user) {
        console.log('Authentication failed: No user in request');
        res.status(401).json({
            message: 'Authentication required'
        });
        return;
    }
    if (typedReq.user.role !== 'BROKER') {
        console.log('Authorization failed: Invalid role:', typedReq.user.role);
        res.status(403).json({
            message: 'Access denied. Broker role required.'
        });
        return;
    }
    console.log('Broker authentication successful:', {
        userId: typedReq.user.id.substring(0, 8) + '...',
        role: typedReq.user.role
    });
    console.log('=== End Broker Authentication ===');
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
    console.log('Authenticating user - Check:', {
        sessionID: typedReq.sessionID?.substring(0, 8) + '...',
        hasSessionUser: !!typedReq.session?.user,
        hasReqUser: !!typedReq.user,
        sessionUserId: typedReq.session?.user?.id?.substring(0, 8) + '...',
        reqUserId: typedReq.user?.id?.substring(0, 8) + '...'
    });
    // 优先使用已经恢复的用户信息（从headers或其他源恢复的）
    if (typedReq.user) {
        console.log('User already authenticated via restore middleware');
        next();
        return;
    }
    // 如果没有已恢复的用户，尝试从session中获取
    if (typedReq.session?.user) {
        typedReq.user = {
            ...typedReq.session.user,
            id: typedReq.session.user.id.toString() // 确保 ID 是字符串
        };
        console.log('User authenticated from session');
        next();
        return;
    }
    // 如果都没有，返回401错误
    console.log('Authentication failed: No user found in session or request');
    res.status(401).json({ message: 'Authentication required' });
    return;
};
exports.authenticateUser = authenticateUser;
