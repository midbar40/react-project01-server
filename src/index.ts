import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Pool } from "pg";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";
import { dot } from "node:test/reporters";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

const postgrePort : number = process.env.POSTGRE_DB_PORT ? parseInt(process.env.POSTGRE_DB_PORT) : 5432;


let corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000/checkscore",
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

// 라우터 임포트
app.use("/api/users", userRouter);

// Postgre DB 연결
const pool = new Pool({
  user: process.env.POSTGRE_DB_USER, 
  host: process.env.POSTGRE_DB_HOST,
  database: process.env.POSTGRE_DB_DATABASE,
  password: process.env.POSTGRE_DB_PASSWORD,
  port: postgrePort,
});


// const queryDatabase = async () => {
//   const client = await pool.connect();
//   try {
//     const res = await client.query("SELECT * FROM users");
//     console.log(res.rows);
//   } finally {
//     client.release();
//   }
// };

// queryDatabase();

// 서버 설정
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
