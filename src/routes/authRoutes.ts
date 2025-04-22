import { prisma } from "../config/prisma";
import bcrypt from "bcrypt"; // 비밀번호 암호화
import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "입력 누락" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "이미 가입된 이메일입니다." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.json({ success: true, email: newUser.email });
  } catch (err) {
    console.error("❌ /register 에러:", err); // 🔥🔥 이거 꼭 넣자
    res.status(500).json({ error: "서버 오류" });
  }
});

router.post("/login", async (req, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({where: {email}})

  if (!user) {
    res.status(401).json({ error: "이메일 또는 비밀번호가 틀렸습니다." });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: "이메일 또는 비밀번호가 틀렸습니다." });
    return;
  }

  req.session.userId = user.id;
  
  res.json({ success: true, email: user.email });
});

router.get("/user", async (req: Request, res: Response): Promise<void> => {

  console.log("💡 session check:", req.session); // 추가
  if (!req.session.userId) {
    res.status(401).json({ error: "로그인이 필요합니다." });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    res.status(401).json({ error: "유저를 찾을 수 없습니다." });
    return;
  }

  res.json(user);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid"); // ✅ 세션 쿠키 삭제
    res.json({ success: true });
  });
});


export default router;
