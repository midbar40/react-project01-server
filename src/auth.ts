import jwt,{JwtPayload} from 'jsonwebtoken'
import {  Request, Response } from "express";
import User, { UserAttributes   } from './models/User'

const secretKey = process.env.JWT_SECRET || '키가없음'
interface InstaceError {
    name: string;
    message: string;
}

// accessToken 생성
export const generateToken = (user: UserAttributes) : string => { //토큰 생성
    return jwt.sign({
        name: user.name,
        email: user.email,
        createdAt:user.createdAt,
    },
    secretKey,  
    {
        expiresIn: '1d', // 만료기한 (하루)
    })
}

// refreshToken 생성
export const isAuth = (req: Request, res: Response) => { // 권한확인
    const bearerToken = req.headers.authorization; // 요청헤더에 저장된 토큰
    if (!bearerToken) {
        res.status(401).json({ message: 'Token is not supplied' }); // 헤더에 토큰이 없는 경우
    } else {
        const token = bearerToken.slice(7, bearerToken.length); // Bearer 글자는 제거하고 jwt 토큰만 추출
        jwt.verify(token, secretKey, (err, userInfo) => {
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