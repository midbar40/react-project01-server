import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";

const app: Express = express();
const port = 5000;

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
app.use(cookieParser());

// 라우터 임포트
app.use("/api/users", userRouter);

// Postgre DB 연결
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "members",
  password: "veritas",
  port: 5432,
});

const queryDatabase = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users");
    console.log(res.rows);
  } finally {
    client.release();
  }
};

queryDatabase();

// 라우터 설정

// 테스트 라우터
app.get("/", (req: Request, res: Response) => {
  console.log(req);
  res.json({
    message: "Hello World!",
    status: 200,
  });
});

app.post("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World!",
    status: 200,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
