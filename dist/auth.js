"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessTokenKey = process.env.JWT_SECRET_AccessToken;
const refreshTokenKey = process.env.JWT_SECRET_RefreshToken;
// accessToken 생성
const generateAccessToken = () => {
    return jsonwebtoken_1.default.sign({
        iss: 'cutomer-finder',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 15 // 15분
    }, accessTokenKey);
};
exports.generateAccessToken = generateAccessToken;
// refreshToken 생성
const generateRefreshToken = () => {
    return jsonwebtoken_1.default.sign({
        iss: 'cutomer-finder',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7일
    }, refreshTokenKey);
};
exports.generateRefreshToken = generateRefreshToken;
// 쿠키 파싱 함수
const parseCookies = (cookieHeader) => {
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
        return cookies;
    }, {});
};
// accessToken 검증
const verifyAccessToken = (req, res, next) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.status(401).json({ message: 'cookie is not supplied' }); // 쿠키가 없는 경우
    }
    else {
        const accessToken = parseCookies(cookieHeader).accessToken;
        jsonwebtoken_1.default.verify(accessToken, accessTokenKey, (err, userInfo) => {
            if (err && err.name === 'TokenExpiredError') { // 토큰만료
                res.status(419).json({ code: 419, message: 'token expired!' });
            }
            else if (err) {
                res.status(401).json({ code: 401, message: 'Invalid Token!' });
            }
            else {
                req.user = userInfo;
                next();
            }
        });
    }
};
exports.verifyAccessToken = verifyAccessToken;
// resfreshToken 검증
const verifyRefreshToken = (req, res) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.status(401).json({ message: 'cookie is not supplied' }); // 쿠키에 토큰이 없는 경우
    }
    else {
        const refreshToken = parseCookies(cookieHeader).refreshToken;
        jsonwebtoken_1.default.verify(refreshToken, refreshTokenKey, (err, userInfo) => {
            if (err && err.name === 'TokenExpiredError') { // 토큰만료
                res.status(419).json({ code: 419, message: 'token expired!' });
            }
            else if (err) {
                res.status(401).json({ code: 401, message: 'Invalid Token!' });
            }
            else {
                req.user = userInfo;
                res.status(200).json({ code: 200, message: '유효한 토큰입니다.' });
            }
        });
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
