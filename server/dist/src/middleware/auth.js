"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.authenticateSeller = exports.authenticateBuyer = exports.authenticateBroker = exports.authenticateAgent = exports.requireAuth = exports.restoreUser = void 0;
const database_1 = require("../../database");
const prisma = (0, database_1.getPrisma)();
// 从 session 恢复用户信息的中间件
const restoreUser = (req, _res, next) => {
    const typedReq = req;
    console.log('Restoring user from session:', {
        sessionID: typedReq.sessionID,
        sessionUser: typedReq.session?.user,
        cookies: typedReq.headers.cookie
    });
    if (typedReq.session?.user) {
        typedReq.user = {
            ...typedReq.session.user,
            id: typedReq.session.user.id.toString() // 确保 ID 是字符串
        };
        console.log('User restored from session:', typedReq.user);
    }
    else {
        console.log('No user found in session');
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
    console.log('Authenticating broker - Session:', typedReq.session);
    console.log('Authenticating broker - User:', typedReq.user);
    if (!typedReq.user) {
        console.log('No user found in request');
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (typedReq.user.role !== 'BROKER') {
        console.log('User is not a broker. Role:', typedReq.user.role);
        res.status(403).json({ message: 'Access denied. Broker role required.' });
        return;
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
