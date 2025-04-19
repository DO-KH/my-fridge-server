import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes";
import authRoutes from "./routes/authRoutes";

// `express-session` 타입 확장 (세션에 userId 추가)
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

dotenv.config(); // .env 파일 로드

const app = express();
const PORT = process.env.PORT || 5000;

//  CORS 설정 (특정 Origin 및 인증 정보 허용)
app.use(
  cors({
    origin: "https://my-fridge-alpha.vercel.app",
    credentials: true, // 인증 정보 포함 (세션 & 쿠키 허용)
  })
);

// JSON 요청 본문을 파싱 (세션보다 먼저!)
app.use(express.json());

// ✅세션 설정 (express-session)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // HTTPS 환경에서는 true로 변경
      httpOnly: true, // 클라이언트에서 쿠키 접근 방지 (보안 강화)
    },
  })
);

// 기본 라우트 (서버 상태 확인)
app.get("/", (req, res) => {
  res.send("서버가 정상적으로 실행 중입니다!");
});

// API 라우트 등록 (순서 중요!)
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행중`);
});
