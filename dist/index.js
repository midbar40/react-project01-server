"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("./db/sequelize"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = require("./routes/index");
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// 모든 모델을 동기화
sequelize_1.default.sync({ force: false })
    .then(() => {
    console.log('DB 생성 성공');
})
    .catch((err) => {
    console.error('DB 생성 실패', err);
});
// 라우터 임포트
app.use("/api/users", index_1.userRouter);
app.use("/api/websearch", index_1.websearchRouter);
// 서버 설정
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
