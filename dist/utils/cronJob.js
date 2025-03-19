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
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../config/db");
// 매일 오전 9시 크롤링
node_cron_1.default.schedule("0 9 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("유툥기한 임박 체크 시작");
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    // 유통기한 임박 식품 조회
    const expiringItems = yield db_1.prisma.item.findMany({
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
}));
