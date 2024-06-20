import express, { Express, Router, Request, Response } from "express";
import User from "../models/User";
import { sendEmail } from "../services/mailjet"
import crypto from 'crypto';

const router = Router();
const users: ClientMap = {};

interface ClientMap {
  [key: string]: express.Response;
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

//  SSE 이벤트 스트림 설정
router.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = crypto.randomBytes(16).toString('hex');
  users[clientId] = res;

  req.on('close', () => {
    delete users[clientId];
  });
});

// 이메일 인증 라우터
router.get('/verify-email', (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };
  console.log('verify-email 토큰', token);
  if (token) {
    Object.values(users).forEach(client => {
      client.write(`data: ${JSON.stringify({ message: 'verified' })}\n\n`);
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
  }
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
      const newUser = User.create({ email, company, name, contact });
      console.log('회원가입 성공 :', newUser)
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
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log('로그인 성공')
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
