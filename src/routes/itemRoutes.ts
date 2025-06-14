import { Router } from "express";
import { prisma } from "../config/prisma";
import { Request, Response } from "express";

const router = Router();

// 모든 아이템 가져오기
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.query; // ✅ 쿼리 파라미터에서 username 가져오기
    if (!username) {
      res.status(400).json({ error: "username이 필요합니다." });
      return;
    }

    const items = await prisma.item.findMany({
      where: { username: String(username) },
    });

    res.json(items);
  } catch (error) {
    console.error("데이터 불러오기 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 아이템 추가
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, name, quantity, expiryDate, receivingDate, category } =
      req.body;

    if (!username || !name || !quantity || !receivingDate || !category) {
      res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
      return;
    }

    const newItem = await prisma.item.create({
      data: { username, name, quantity, expiryDate, receivingDate, category },
    });

    res.json(newItem);
  } catch (error) {
    console.error("데이터 추가 오류:", error);
    res.status(500).json({ error: "데이터 추가 실패" });
  }
});

// 아이템 삭제
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.item.delete({ where: { id } });
    res.json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

// 아이템 수량 업데이트
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      res.status(400).json({ error: "수량을 입력해주세요." });
      return;
    }

    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: { quantity },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("수량 업데이트 오류:", error);
    res.status(500).json({ error: "수량 업데이트 실패" });
  }
});

// 유통기한 임박 아이템 조회
router.get(
  "/expiring-soon",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);

      // 유통기한이 오늘 ~ 3일 이내인 아이템 조회
      const expiringItems = await prisma.item.findMany({
        where: {
          expiryDate: {
            gte: today.toISOString(),
            lte: threeDaysLater.toISOString(),
          },
        },
      });
      res.json(expiringItems);
    } catch (err) {
      res.status(500).json({ err: "유통기한 임박 식품 조회 실패" });
    }
  }
);

// 데이터 이관
router.post("/bulk", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, items } = req.body;

    if (!username || !Array.isArray(items)) {
      res.status(400).json({ message: "잘못된 요청 형식입니다." });
      return;
    }

    // 유저 확인
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({message: "사용자를 찾을 수 없습니다."})
      return;
    }

    // DB에 bulk insert
    await prisma.item.createMany({
      data: items.map((item) => ({
        username,
        name: item.name,
        quantity: item.quantity,
        expiryDate: item.expiryDate ?? null,
        receivingDate: item.receivingDate,
        category: item.category,
      })),
    });

    res.status(200).json({ message: "데이터 이관 성공" });

  } catch (err) {
    console.error("Bulk 등록 에러:", err);
    res.status(500).json({ message: "서버 에러" });
  }
});

export default router;
