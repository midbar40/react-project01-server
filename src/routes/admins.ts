import { Router, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken, setAccessTokenCookie, setRefreshTokenCookie, isAdmin } from "../services/auth";
import { checkIsAdminAsEmail, createAdmin, logout, login, getAdminInfo } from "../services/adminAuthService"
import { sendEmail } from "../services/mailjet"
import { sendEventToClients, setServerSentEvent, handleClientDisconnect } from "../services/eventService"

const router = Router();
const emails: EmailMap = {}; // 이메일을 저장할 객체

interface EmailMap {
  [key: string]: string;
}

// 최초 회원가입화면에서 회원가입 버튼 클릭
router.post("/emailAuth", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const isAdmin = await checkIsAdminAsEmail(email)
    if (isAdmin) {
      res.status(400).json({ message: "이미 존재하는 관리자입니다" });
    } else {
      const result = sendEmail(email)
      res.status(200).json({ message: "이메일 전송 성공", result });
    }
  } catch (error) {
    res.status(400).json({ message: "이메일 전송 실패" });
  }
})

//  Servser-Sent-Event 설정
router.get('/events', (req: Request, res: Response) => {
  const clientId = setServerSentEvent(res)
  req.on('close', () => {
    handleClientDisconnect(clientId)
  });
});

// 이메일 인증 라우터
router.get('/verify-email', async (req: Request, res: Response) => {
  const email = emails["email"]
  const isAdmin = await checkIsAdminAsEmail(email)
  const { token } = req.query as { token?: string };

  if (isAdmin) {// 로그인 : 등록된 유저이면 토큰을 확인하고, login을 위한 쿠키를 설정하고, 이메일 인증 완료 메시지를 보냄
    if (token) {
      setAccessTokenCookie(req, res)
      setRefreshTokenCookie(req, res)
      sendEventToClients('user_verified')
      res.send(
        `
        <script>
            alert('이메일 인증이 완료되었습니다.');
            window.close();
        </script>
        `
      );
    } else {
      res.send(
        `
        <script>
            alert('이메일 인증에 실패하였습니다.');
            window.close();
        </script>
        `
      );
    }
  } else {// 회원가입 : 등록된 유저가 아니면 토큰을 확인하고 이메일 인증 확인 메시지를 보냄
    if (token) {
      sendEventToClients('verified')
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
  }
});

// 정보 모두 입력 후 회원가입 버튼 클릭
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, company, name, contact } = req.body;
    const isAdmin = await checkIsAdminAsEmail(email)
    if (isAdmin) {
      res.status(400).json({ message: "aleadyExist" });
    }
    else {
      await createAdmin({ email, name })
      // 쿠키설정 및 로그인 처리
      setAccessTokenCookie(req, res)
      setRefreshTokenCookie(req, res)
      sendEventToClients('user_verified')
      res.status(200).json({ message: "success" });
    }
  } catch (error) {
    res.status(400).json({ message: "falied" });
  }
})

// 로그인
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    emails["email"] = email;
    const loginStatus = await login(email)
    if (loginStatus) {
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ message: "notExist" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "알 수 없는 오류가 발생했습니다" });
    }
  }
});

// user 정보 가져오기
router.get("/info", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    const email = emails["email"]
    const AdminInfo = await getAdminInfo(email)
    if (AdminInfo) {
      res.status(200).json({ message: 'success', data: AdminInfo });
    } else {
      res.status(404).json({ message: '유저정보를 찾을 수 없습니다' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message })
    } else {
      res.status(500).json({ message: '알 수 없는 에러가 발생했습니다, 유저정보 획득 실패' })
    }
  }
});

// 로그아웃
router.get("/logout", async (req: Request, res: Response) => {
  try {
    logout(res)
    res.status(200).json({ message: '로그아웃에 성공했습니다.' })
  } catch (error) {
    res.status(401).json({ message: '로그아웃에 실패했습니다.' })
  }
})

// 로그인 상태 유지 체크
router.get("/check-login", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    res.status(200).json({ isLoggedIn: true, user: req.user });
  } catch (error) {
    res.status(401).json({ isLoggedIn: false, message: '로그인상태를 확인하는데 실패했습니다.' })
  }
});

// refreshToken으로 accessToken 재발급
router.get("/refresh-token", verifyRefreshToken, async (req: Request, res: Response) => {
  try {
    res.status(200).json({ refreshIsValid: true, message: 'refreshTokein is valid' })
  } catch (error) {
    res.status(401).json({ refreshIsValid: false, message: 'refreshToken 에러' })
  }
});

export default router;
