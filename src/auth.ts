import jwt from 'jsonwebtoken'
import {  Request, Response, NextFunction } from "express";
import { UserAttributes } from './models/User'
 
const accessTokenKey = process.env.JWT_SECRET_AccessToken 
const refreshTokenKey = process.env.JWT_SECRET_RefreshToken

// accessToken 생성
export const generateAccessToken = (user: UserAttributes) : string => { 
    return jwt.sign({
        name: user.name,
        email: user.email,
        createdAt:user.createdAt,
    },
    accessTokenKey,  
    {
        expiresIn: '15m', 
    })
}

// refreshToken 생성
export const generateRefreshToken = (user:UserAttributes) : string => {
    return jwt.sign({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    },
    refreshTokenKey,
    {
        expiresIn: '7d'
    })
}

// 쿠키 파싱 함수
const parseCookies = (cookieHeader : string) : {[key:string]: string} => {
    return cookieHeader.split(';').reduce((cookies : {[key:string]: string}, cookie : string) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
        return cookies;
    }, {});
}

// accessToken 검증
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => { 
    const cookieHeader = req.headers.cookie
    if (!cookieHeader) {
        res.status(401).json({ message: 'cookie is not supplied' }); // 쿠키가 없는 경우
    } else {
        const accessToken = parseCookies(cookieHeader).accessToken
        jwt.verify(accessToken, accessTokenKey, (err, userInfo) => {
            if (err && err.name === 'TokenExpiredError') { // 토큰만료
                res.status(419).json({ code: 419, message: 'token expired!' });
            } else if (err) {
                res.status(401).json({ code: 401, message: 'Invalid Token!' });
            } else {
                req.user = userInfo as UserAttributes;
                next();
            }            
        });
    }
}

// resfreshToken 검증
export const verifyRefreshToken = (req: Request, res: Response) => { 
    const cookieHeader = req.headers.cookie
    if (!cookieHeader) {
        res.status(401).json({ message: 'cookie is not supplied' }); // 쿠키에 토큰이 없는 경우
    } else {
        const refreshToken = parseCookies(cookieHeader).refreshToken
        jwt.verify(refreshToken, refreshTokenKey, (err, userInfo) => {
            if (err && err.name === 'TokenExpiredError') { // 토큰만료
                res.status(419).json({ code: 419, message: 'token expired!' });
            } else if (err) {
                res.status(401).json({ code: 401, message: 'Invalid Token!' });
            } else {
                req.user = userInfo as UserAttributes;
                res.status(200).json({ code: 200, message: '유효한 토큰입니다.' });
            }            
        });
    }
}


