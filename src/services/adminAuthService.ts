import Admin from "../models/Admin";
import { Router, Request, Response } from "express";
import { sendEmail } from "../services/mailjet"

interface AdminCreationAttributes {
    email: string;
    name: string;
}

export const checkIsAdminAsEmail = async (email: string): Promise<boolean> => {
    const admin = await Admin.findOne({ where: { email } });
    return !!admin
}

export const createAdmin = async (adminInfo: AdminCreationAttributes) => {
    const { email, name } = adminInfo
    const newAdmin = await Admin.create({ email, name, role: "admin", createdAt: new Date(), updatedAt: new Date() });
    return newAdmin;
}

export const logout = (res: Response) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
}

export const login = async (email: string): Promise<boolean> => {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
        throw new Error("존재하지 않는 관리자입니다")
    } else {
        await sendEmail(email)
        return true
    }
}

export const getAdminInfo = async (email: string): Promise<Admin | null> => {
    const admin = await Admin.findOne({ where: { email } });
    if (admin) {
        return admin;
    } else {
        throw new Error("존재하지 않는 관리자입니다")
    }
}
