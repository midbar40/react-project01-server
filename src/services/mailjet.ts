import mailjet from 'node-mailjet';
import crypto from 'crypto';

const mailjetApiKeys = process.env.MAILJET_API_KEYS;
const mailjetSecretKeys = process.env.MAILJET_SECRET_KEYS;

// Mailjet API를 사용하기 위한 클라이언트 생성
const mailjetClient = mailjet.apiConnect(
  mailjetApiKeys as string,
  mailjetSecretKeys as string
);

export const sendEmail = async (email: string, path: string, token:string, sessionID: string): Promise<void> => {
  // redis에 email과 token을 저장, 만료기한을 설정
  console.log('sendEmail', sessionID)
  const verificationLink = `http://localhost:5000/api/${path}/verify-email?token=${token}&email=${email}&sessionID=${sessionID}` 
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
            Subject: 'PC에서 이메일 인증을 진행해주세요, 모바일 환경에서는 인증이 되지 않습니다.',
            TextPart: '아래 링크를 클릭하여 이메일 인증을 진행해주세요.',
            HTMLPart: emailHtml,
            CustomID: 'AppGettingStartedTest',
          }
        ]
      });

    const result = await request;
    // console.log('sendEmail result :', result.body)
  } catch (err: any) {
    console.error(err.statusCode);
  }
};

