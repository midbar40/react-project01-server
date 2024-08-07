import { Router, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken, setAccessTokenCookie, setRefreshTokenCookie } from "../services/auth";
import { checkIsUserAsEmail, createUser, logout, login, getUserInfo } from "../services/userAuthService"
import { sendEmail } from "../services/mailjet"
import { sendEventToClients, setServerSentEvent, handleClientDisconnect } from "../services/eventService"
import { client } from '../services/redis'
import crypto from 'crypto';

const router = Router();

// 최초 회원가입화면에서 회원가입 버튼 클릭
router.post("/emailAuth", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const sessionID = req.sessionID; // 새 요청마다 고유한 세션 ID 생성
    const token = crypto.randomBytes(20).toString('hex');

    // 기존의 세션 ID가 존재할 경우 삭제 (기존 요청 무효화)
    const existingSessionID = await client.hGet('user:' + email, 'sessionID');
    if (existingSessionID) {
      await client.del(existingSessionID);
    }

    // 새로 생성된 세션 ID와 토큰을 Redis에 저장
    await client.hSet(sessionID, {
      email: email,
      token: token
    });
    await client.hSet('user:' + email, { sessionID });

    const isUser = await checkIsUserAsEmail(email);
    if (isUser) {
      res.status(400).json({ message: "이미 존재하는 회원입니다" });
    } else {
      const result = await sendEmail(email, 'users', token, sessionID);
      res.status(200).json({ message: "이메일 전송 성공", sessionID });
    }
  } catch (error) {
    console.error("Error in emailAuth:", error);
    res.status(400).json({ message: "이메일 전송 실패" });
  }
});

//  Servser-Sent-Event 설정
router.get('/events', (req: Request, res: Response) => {
  const clientId = setServerSentEvent(res)
  req.on('close', () => {
    handleClientDisconnect(clientId)
  });
});

// 이메일 인증 라우터
router.get('/verify-email', async (req: Request, res: Response) => {
  const { token, sessionID, email } = req.query as { token?: string, sessionID?: string, email: string };

  if (!sessionID || !token) {
    res.status(400).send(
      `
      <script>
          alert('잘못된 접근입니다.');
          window.close();
      </script>
      `
    );
    return;
  }

  const redisEmail = await client.hGet(sessionID, 'email');
  const redisToken = await client.hGet(sessionID, 'token');

  if (!redisEmail || !redisToken) {
    res.status(400).send(
      `
      <script>
          alert('세션이 만료되었거나 잘못된 세션입니다.');
          window.close();
      </script>
      `
    );
    return;
  }

  // 토큰 검증
  if (redisToken === token && redisEmail === email) {
    const isUser = await checkIsUserAsEmail(email);

    // 토큰 사용 후 삭제 (무효화)
    await client.del(sessionID);

    if (isUser) {
      setAccessTokenCookie(req, res);
      setRefreshTokenCookie(req, res);
      sendEventToClients('user_verified');
    } else {
      sendEventToClients('verified');
    }

    res.send(
      `
      <script>
          alert('이메일 인증이 완료되었습니다.');
          window.close();
      </script>
      `
    );
  } else {
    res.status(400).send(
      `
      <script>
          alert('잘못된 토큰입니다.');
          window.close();
      </script>
      `
    );
  }
});

// 정보 모두 입력 후 회원가입 버튼 클릭
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, company, name, contact } = req.body;
    const isUser = await checkIsUserAsEmail(email)
    if (isUser) {
      res.status(400).json({ message: "aleadyExist" });
    }
    else {
      await createUser({ email, company, name, contact })
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
    const sessionID = req.sessionID
    const token = crypto.randomBytes(20).toString('hex');
    await client.hSet(sessionID, {
      email: email,
      token: token
    })
    const loginStatus = await login(email, token, sessionID)
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
    // const email = emails["email"]
    const sessionID = req.sessionID
    const email = await client.hGet(sessionID, 'email')
    const userInfo = await getUserInfo(email as string)
    if (userInfo) {
      res.status(200).json({ message: 'success', data: userInfo });
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
    logout(res, req)
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
