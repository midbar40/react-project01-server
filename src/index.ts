import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import sequelize from "./db/sequelize";
import cors from "cors";
import cookieParser from "cookie-parser";
import { adminRouter, userRouter, websearchRouter } from "./routes/index";
import session from 'express-session'
import RedisStore from 'connect-redis';
import {  client, connectRedis } from './services/redis'

const app: Express = express();
const port = process.env.PORT || 5000;

let corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// redis 연결
connectRedis()
.then(() => {
  console.log('Redis connected successfully');
})
.catch(err => {
  console.error('Error connecting to Redis', err);
});

// 미들웨어
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  store: new RedisStore({ client }),
  secret : process.env.SESSION_KEY as string,
  resave : false, // 세션이 수정되지 않으면 저장하지 않도록 설정
  saveUninitialized: true,   // 세션이 생성된 후에 수정되지 않은 경우에도 저장하도록 설정
  cookie: { 
    maxAge: 3600 * 1000 * 3 ,
    secure: false, // HTTPS가 아닌 경우 false
    httpOnly: true, // 클라이언트 사이드 스크립트에서 접근할 수 없도록
    sameSite: 'lax' // 쿠키가 동일 사이트에서만 전송되도록
  }  // HTTPS가 아니면 secure 옵션을 false로 설정
}))



// 모든 모델을 동기화
sequelize.sync({ force: false })
  .then(() => {
    console.log('DB 생성 성공');
  })
  .catch((err) => {
    console.error('DB 생성 실패', err);
  });


// 라우터 임포트
app.use("/api/users", userRouter);
app.use("/api/admins", adminRouter);
app.use("/api/websearch", websearchRouter);

// 서버 설정
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
