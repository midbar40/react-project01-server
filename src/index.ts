import express, { Express, Request, Response } from "express";
import sequelize from "./db/sequelize";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter, websearchRouter } from "./routes/index";
import { dot } from "node:test/reporters";

const app: Express = express();
const port = process.env.PORT || 5000;

let corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 미들웨어
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 모든 모델을 동기화
sequelize.sync({ force : false })
.then(()=> {
  console.log('DB 생성 성공');
})
.catch((err) => {
  console.error('DB 생성 실패',err);
});


// 라우터 임포트
app.use("/api/users", userRouter);
app.use("/api/websearch", websearchRouter);

// 서버 설정
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
