import mailjet from 'node-mailjet';
import crypto from 'crypto';

const mailjetApiKeys = process.env.MAILJET_API_KEYS;
const mailjetSecretKeys = process.env.MAILJET_SECRET_KEYS;

// Mailjet API를 사용하기 위한 클라이언트 생성
const mailjetClient = mailjet.apiConnect(
  mailjetApiKeys as string,
  mailjetSecretKeys as string
);



export const sendEmail = async (email: string): Promise<void> => {

  // 랜덤 토큰 생성
  const token = crypto.randomBytes(20).toString('hex');
  // 토큰 DB 저장
  const verificationLink = `http://localhost:5000/api/users/verify-email?token=${token}`
  const emailHtml = `<h4>아래 링크를 클릭하여 이메일 인증을 진행해주세요.</h4><br><h3><a href='${verificationLink}'>이메일 인증 링크</a></h3>`
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
            Subject: '이메일 인증을 진행해주세요.',
            TextPart: '아래 링크를 클릭하여 이메일 인증을 진행해주세요.',
            HTMLPart: emailHtml,
            CustomID: 'AppGettingStartedTest',
          }
        ]
      });

    const result = await request;
    console.log('sendEmail result :', result.body)
  } catch (err: any) {
    console.error(err.statusCode);
  }
};

