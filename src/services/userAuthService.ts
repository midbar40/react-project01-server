import express, { Router, Request, Response } from "express";
import User from '../models/User';
import { sendEmail } from "../services/mailjet"
import { connectRedis, client } from '../services/redis'

interface UserCreationAttributes {
    email: string;
    company: string;
    name: string;
    contact: string;
}

export const checkIsUserAsEmail = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ where: { email } });
    return !!user
}

export const createUser = async (userDetail: UserCreationAttributes) => {
    const { email, company, name, contact } = userDetail
    const newUser = await User.create({ email, company, name, contact, createdAt: new Date(), updatedAt: new Date() });
    return newUser;
}

export const logout = async (res: Response, req: Request) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    await client.del(req.session.id)
    req.session.id = ''
}

export const login = async (email: string, token: string, sessionID:string): Promise<boolean> => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("존재하지 않는 회원입니다")
    } else {
        await sendEmail(email, 'users', token, sessionID)
        return true
    }
}

export const getUserInfo = async (email: string): Promise<User | null> => {
    const user = await User.findOne({ where: { email } });
    if (user) {
        return user;
    } else {
        throw new Error("존재하지 않는 회원입니다")
    }
}