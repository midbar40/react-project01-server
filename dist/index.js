"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
const port = 5000;
// 라우터 임포트
app.use("/api/users", users_1.default);
// Postgre DB 연결
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "junwonSite",
    password: "veritas",
    port: 5432,
});
const queryDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const res = yield client.query("SELECT * FROM users");
        console.log(res.rows);
    }
    finally {
        client.release();
    }
});
queryDatabase();
let corsOptions = {
    origin: [
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3000/checkscore",
        "http://localhost:3000",
    ],
    credentials: true,
};
// 미들웨어
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// 라우터 설정
// 테스트 라우터
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/", (req, res) => {
    res.send("post request");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
