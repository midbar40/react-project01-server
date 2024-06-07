"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const postgrePort = process.env.POSTGRE_DB_PORT ? parseInt(process.env.POSTGRE_DB_PORT) : 5432;
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// 라우터 임포트
app.use("/api/users", users_1.default);
// Postgre DB 연결
const pool = new pg_1.Pool({
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
