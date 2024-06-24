import jwt from 'jsonwebtoken'
import {  Request, Response } from "express";
import User, { UserAttributes } from './models/User'

const secretKey = process.env.JWT_SECRET || '키가없음'
interface InstaneError {
    name: string;
    message: string;
}
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

export const isAuth = async (req: Request, res : Response) => { // 권한확인
    const bearerToken = req.headers.authorization // 요청헤더에 저장된 토큰
    if(!bearerToken){
        res.status(401).json({message: 'Token is not supplied'}) // 헤더에 토큰이 없는 경우
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // Bearer 글자는 제거하고 jwt 토큰만 추출
        try {
            const decoded = jwt.verify(token, secretKey) as UserAttributes;
            const user = await User.findOne({ where: { email: decoded.email } });
    
            if (!user) {
                return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
            }
    
            req.user = user; // 사용자 인스턴스를 req.user에 할당
    
            return res.status(200).json({ message: '유효한 토큰입니다.' });
        } catch (error : unknown) {
            const err = error as InstaneError;
            if (err.name === 'TokenExpiredError') {
                return res.status(419).json({ message: '토큰이 만료되었습니다.' });
            } else {
                return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
            }
    }
}
}
