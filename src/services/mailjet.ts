import mailjet from 'node-mailjet';
import crypto from 'crypto';

// Mailjet API를 사용하기 위한 클라이언트 생성
const mailjetClient = mailjet.apiConnect(
  process.env.Mailjet_API_Keys || '',
  process.env.Mailjet_Secret_Keys || ''
);

interface EmailOptions {
  email: string;
  subject: string;
  text: string;
  html: string;
}

interface Recipient {
  Email: string;
  MessageUUID: string;
  MessageID: string;
  MessageHref: string;
}

interface SentMessage {
  Status: string;
  CustomID: string;
  To: Recipient[];
}

interface MailjetResponse {
  Messages: SentMessage[];
}

export const sendEmail = async ({ email, subject, text, html }: EmailOptions): Promise<any> => {
  const token = crypto.randomBytes(20).toString('hex');
  console.log('토큰', token)

  const verificationLink = `http://127.0.0.1:3000/verify-email?token=${token}`
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
            Subject: subject,
            TextPart: text,
            HTMLPart: emailHtml,
            CustomID: 'AppGettingStartedTest',

          }
        ]
      });

    const result = await request;
    // .then에 결과 반환하면 다른 함수에서 사용할 수 있나? : then은 비동기 함수이기 때문에 결과를 반환할 수 없다.
    const response: MailjetResponse = result.body as unknown as MailjetResponse;

    if (response.Messages && response.Messages.length > 0) {
      const messageID = response.Messages[0].To[0].MessageID;
      return messageID; // 메시지 ID를 반환
    } else {
      throw new Error('No messages in response');
    }
  } catch (err: any) {
    console.error(err.statusCode);
  }
};

