"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const node_mailjet_1 = __importDefault(require("node-mailjet"));
const crypto_1 = __importDefault(require("crypto"));
const mailjetApiKeys = process.env.MAILJET_API_KEYS;
const mailjetSecretKeys = process.env.MAILJET_SECRET_KEYS;
// Mailjet API를 사용하기 위한 클라이언트 생성
const mailjetClient = node_mailjet_1.default.apiConnect(mailjetApiKeys, mailjetSecretKeys);
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, subject, text, html }) {
    // 랜덤 토큰 생성
    const token = crypto_1.default.randomBytes(20).toString('hex');
    // 토큰 DB 저장
    const verificationLink = `http://localhost:5000/api/users/verify-email?token=${token}`;
    const emailHtml = `<h4>아래 링크를 클릭하여 이메일 인증을 진행해주세요.</h4><br><h3><a href='${verificationLink}'>이메일 인증 링크</a></h3>`;
    try {
        const request = mailjetClient
            .post('send', { version: 'v3.1' })
            .request({
            Messages: [
                {
                    From: {
                        Email: 'inyo0506@gmail.com',
                        Name: 'Customer Finder'
                    },
                    To: [
                        {
                            Email: email,
                            Name: 'seunghyun'
                        }
                    ],
                    Subject: subject,
                    TextPart: text,
                    HTMLPart: emailHtml,
                    CustomID: 'AppGettingStartedTest',
                }
            ]
        });
        const result = yield request;
        console.log('sendEmail result :', result.body);
    }
    catch (err) {
        console.error(err.statusCode);
    }
});
exports.sendEmail = sendEmail;
