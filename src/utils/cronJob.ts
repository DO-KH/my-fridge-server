import cron from "node-cron";
import { prisma } from "../config/db";

// 매일 오전 9시 크롤링
cron.schedule("0 9 * * *", async ()=>{
  console.log("유툥기한 임박 체크 시작")

  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  // 유통기한 임박 식품 조회
  const expiringItems = await prisma.item.findMany({
    where: {
      expiryDate: {
        gte: today.toISOString(),
        lte: threeDaysLater.toISOString(),
      }
    }
  });

  if (expiringItems.length > 0) {
    console.log("유통기한이 임박한 식품: ", expiringItems);
    // 여기서 푸시 알림 또는 이메일 전송 로직 추가 가능
  }
});