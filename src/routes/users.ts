import express, { Express, Router, Request, Response } from "express";
import User from "../models/User";
import { sendEmail } from "../services/mailjet"
import crypto from 'crypto';
import { generateToken } from "../auth";

const router = Router();
const users: ClientMap = {}; // 클라이언트 객체를 저장할 객체
const emails: EmailMap = {}; // 이메일을 저장할 객체

interface ClientMap {
  [key: string]: express.Response; // key는 string, value는 express.Response인 객체
}
interface EmailMap {
  [key: string] : string;
}


// 최초 회원가입화면에서 회원가입 버튼 클릭
router.post("/emailAuth", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const emailOption = {
      email: email,
      subject: '이메일 인증을 진행해주세요.',
      text: '아래 링크를 클릭하여 이메일 인증을 진행해주세요.',
      html: '아래 링크를 클릭하여 이메일 인증을 진행해주세요.'
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log('이미 존재하는 회원입니다.')
      res.status(400).json({ message: "aleadyExist" });
    } else {
      const result = await sendEmail(emailOption); // 토큰 생성 후 DB저장 및 이메일 전송
      res.status(200).json({ message: "success", data: result });
    }
  } catch (error) {
    console.log('이메일 전송 에러', error)
    res.status(400).json({ message: "이메일 전송 에러" });
  }
})

//  Servser-Sent-Event 설정
router.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream'); // 서버가 클라이언트에게 보내는 컨텐츠 타입, text/event-stream은 서버-클라이언트 간의 단방향 통신을 위한 타입
  res.setHeader('Cache-Control', 'no-cache'); // 클라이언트가 캐싱하지 않도록 설정, 항상 서버로부터 데이터를 받아옴
  res.setHeader('Connection', 'keep-alive'); // 서버와 클라이언트의 연결 유지, 클라이언트가 연결을 끊을 때까지 계속 연결 유지

  const clientId = crypto.randomBytes(16).toString('hex');
  users[clientId] = res; // users 객체의 key로 클라이언트 아이디, value로 res 객체 저장

  req.on('close', () => {
    delete users[clientId]; // 클라이언트 연결 종료 시 users 객체에서 해당 클라이언트 삭제
  });
});

// 이메일 인증 라우터
router.get('/verify-email', async (req: Request, res: Response) => {
  const email = emails["email"] 
  console.log('verify-email 이메일', email)
  const user = await User.findOne({ where: { email } });
  const { token } = req.query as { token?: string };
  console.log('verify-email 토큰', token);


  if(user) {// 등록된 유저이면 토큰을 확인하고, login을 위한 쿠키를 설정하고, 이메일 인증 완료 메시지를 보냄
    if(token){
      res.cookie('midbar_token', generateToken(user), {
                path: '/',
                expires: new Date(Date.now() + 900000),
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
      Object.values(users).forEach(client => { // users 객체의 value들을 순회하며, 클라이언트에게 이벤트 전송
        client.write(`data: ${JSON.stringify({ message: 'user_verified' })}\n\n`); // \n\n은 이벤트의 끝을 의미
      });
      res.send(
        `
        <script>
            alert('이메일 인증이 완료되었습니다.');
            window.close();
        </script>
        `
      );
    }else {
      res.send(
        `
        <script>
            alert('이메일 인증에 실패하였습니다.');
            window.close();
        </script>
        `
      );
    }
  }else{// 등록된 유저가 아니면 토큰을 확인하고 이메일 인증 확인 메시지를 보냄
  if (token) { 
    Object.values(users).forEach(client => { // users 객체의 value들을 순회하며, 클라이언트에게 이벤트 전송
      client.write(`data: ${JSON.stringify({ message: 'verified' })}\n\n`); // \n\n은 이벤트의 끝을 의미
    });
    res.send(
      `
      <script>
          alert('이메일 인증이 완료되었습니다.');
          window.close();
      </script>
      `
    );
  } else {
    `
    <script>
        alert('이메일 인증에 실패하였습니다.');
        window.close();
    </script>
    `
  }}
});

// 정보 모두 입력 후 회원가입 버튼 클릭
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, company, name, contact } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log('이미 존재하는 회원입니다.')
      res.status(400).json({ message: "aleadyExist" });
    } else {
      const newUser = User.create({ email, company, name, contact, createdAt: new Date(), updatedAt: new Date()});
      console.log('회원가입 성공 :', newUser)
      // 쿠키설정 및 로그인 처리
      res.status(200).json({ message: "success", data: newUser });
    }
  } catch (error) {
    console.log('회원가입 실패', error)
    res.status(400).json({ message: "falied" });
  }
})

// 로그인
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    emails["email"] = email;
    console.log("로그인 emails[email] :", emails["email"])
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log('로그인 진행중')
      const emailOption = {
        email: email,
        subject: '이메일 인증을 진행해주세요.',
        text: '아래 링크를 클릭하여 이메일 인증을 진행해주세요.',
        html: '아래 링크를 클릭하여 이메일 인증을 진행해주세요.'
      }
      const result = await sendEmail(emailOption); // 토큰 생성 후 DB저장 및 이메일 전송
      res.status(200).json({ message: "success", data: user });
    } else {
      console.log('로그인 실패')
      res.status(400).json({ message: "failed" });
    }
  } catch (error) {
    console.log('로그인 에러', error)
    res.status(400).json({ message: "로그인 에러" });
  }
});

export default router;
