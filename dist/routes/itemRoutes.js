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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// ✅ 모든 아이템 가져오기
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield db_1.prisma.item.findMany();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: "서버 오류" });
    }
}));
// ✅ 아이템 추가
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, quantity, expiryDate, receivingDate, category } = req.body;
        const newItem = yield db_1.prisma.item.create({
            data: { name, quantity, expiryDate, receivingDate, category },
        });
        res.json(newItem);
    }
    catch (error) {
        res.status(500).json({ error: "데이터 추가 실패" });
    }
}));
// ✅ 아이템 삭제
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield db_1.prisma.item.delete({ where: { id } });
        res.json({ message: "삭제 완료" });
    }
    catch (error) {
        res.status(500).json({ error: "삭제 실패" });
    }
}));
// 유통기한 임박 아이템 조회
router.get("/expiring-soon", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
        // 유통기한이 오늘 ~ 3일 이내인 아이템 조회
        const expiringItems = yield db_1.prisma.item.findMany({
            where: {
                expiryDate: {
                    gte: today.toISOString(),
                    lte: threeDaysLater.toISOString(),
                }
            }
        });
        res.json(expiringItems);
    }
    catch (err) {
        res.status(500).json({ err: "유통기한 임박 식품 조회 실패" });
    }
}));
exports.default = router;
