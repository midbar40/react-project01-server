import { Router, Request, Response } from "express";
import User from "../models/User";
import { sendEmail } from "../services/mailjet"
const router = Router();

// 회원가입
router.post("/emailAuth", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('email', email)
    console.log('리퀘바디', req.body)
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
      const result = await sendEmail(emailOption);
     
      // if(result === 'success'){
      //   console.log('이메일 전송 성공', result)
      //   res.status(200).json({ message: "success" });
      // }
    }
  } catch (error) {
    console.log('이메일 전송 에러', error)
    res.status(400).json({ message: "이메일 전송 에러" });
  }
})

router.post("/signup", async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { email, company, name, contact } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log('이미 존재하는 회원입니다.')
      res.status(400).json({ message: "aleadyExist" });
    } else {
      const newUser = User.create({ email, company, name, contact });
      res.status(200).json({ message: "success", data: newUser });
    }
  } catch (error) {
    console.log('회원가입 실패', error)
    res.status(400).json({ message: "falied" });
  }
})

// 이메일 인증
router.get("/verify-email", async (req: Request, res: Response) => {
  const { token } = req.query;
  console.log('토큰', token)
  res.status(200).json({ message: "success" });
  // 페이지 이동
  res.redirect('http://127.0.0.1:3000/register');
})


// 로그인
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (user) {
      console.log('로그인 성공')
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
