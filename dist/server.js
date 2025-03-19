"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config(); // .env 파일 로드
const app = (0, express_1.default)();
// ✅ 미들웨어 설정
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // JSON 요청 본문을 파싱
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "default_secret", // 보안 키 (환경 변수로 설정 추천)
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // HTTPS 환경이면 `true`로 변경
}));
const PORT = process.env.PORT || 5000;
// ✅ 서버 실행
app.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
// ✅ 기본 라우트
app.get("/", (req, res) => {
    res.send("🚀 서버가 정상적으로 실행 중입니다!");
});
app.use("/api/items", itemRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
