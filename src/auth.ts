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


export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => { // 권한확인
    const bearerToken = req.headers.authorization; // 요청헤더에 저장된 토큰
    if (!bearerToken) {
        res.status(401).json({ message: 'Token is not supplied' }); // 헤더에 토큰이 없는 경우
    } else {
        const token = bearerToken.slice(7, bearerToken.length); // Bearer 글자는 제거하고 jwt 토큰만 추출
        jwt.verify(token, accessTokenKey, (err, userInfo) => {
            if (err && err.name === 'TokenExpiredError') { // 토큰만료
                res.status(419).json({ code: 419, message: 'token expired!' });
            } else if (err) {
                res.status(401).json({ code: 401, message: 'Invalid Token!' });
            } else {
                req.user = userInfo as UserAttributes;
                res.status(200).json({ code: 200, message: '유효한 토큰입니다.' });
                next();
            }            
        });
    }
}

export const verifyRefreshToken = (req: Request, res: Response) => { // 권한확인
    const bearerToken = req.headers.authorization; // 요청헤더에 저장된 토큰
    if (!bearerToken) {
        res.status(401).json({ message: 'Token is not supplied' }); // 헤더에 토큰이 없는 경우
    } else {
        const token = bearerToken.slice(7, bearerToken.length); // Bearer 글자는 제거하고 jwt 토큰만 추출
        jwt.verify(token, refreshTokenKey, (err, userInfo) => {
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


