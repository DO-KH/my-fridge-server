import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

import express from "express";
import session from "express-session";
import cors from "cors";
import itemRoutes from "./src/routes/itemRoutes";
import authRoutes from "./src/routes/authRoutes";

// `express-session` 타입 확장 (세션에 userId 추가)
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1); 


app.use(
  cors({
    origin: ["https://my-fridge-alpha.vercel.app", "http://localhost:5173"],
    credentials: true, // 인증 정보 포함 (세션 & 쿠키 허용)
  })
);

// JSON 요청 본문을 파싱 (세션보다 먼저!)
app.use(express.json());


app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1일
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
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

app.post('/test', (req, res) => {
  let test = req.body.test;
  res.json({ result: test });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행중`);
});
// export default function handler(req: VercelRequest, res: VercelResponse) {
//   app(req as any, res as any);
// }