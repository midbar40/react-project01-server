import Admin from "../models/Admin";
import { sendEmail } from "../services/mailjet"

export const checkIsAdminAsEmail = async (email : string) :Promise<boolean>=> {
    const admin = await Admin.findOne({ where: { email } });
    return !!admin
}
export const sendEmailVerification = async (email: string) => {
    try {
        const admin = await Admin.findOne({ where: { email } });
        if (Admin) {
            throw new Error("이미 존재하는 회원입니다")
        } else {
            const result = await sendEmail(email); // 토큰 생성 후 DB저장 및 이메일 전송
            return result
        }
    } catch (error : unknown) {
        if(error instanceof Error){
            if(error.message === "이미 존재하는 회원입니다"){
                throw error;
            } else {
                throw new Error(`이메일 인증 실패 : ${error.message}`)
            }
        }else {
            throw new Error("알 수 없는 에러 발생, 이메일 전송 실패")
        }
    }
}