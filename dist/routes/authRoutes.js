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
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt")); // 비밀번호 암호화
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    // 중복 이메일 확인
    const existingUser = yield db_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(400).json({ error: "이미 가입된 이메일입니다." });
        return;
    }
    // 비밀번호 해싱 (암호화)
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // 새 사용자 생성
    const newUser = yield db_1.prisma.user.create({
        data: { email, password: hashedPassword, name },
    });
    res.json({ success: true, email: newUser.email });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_1.prisma.user.findUnique({ where: { email } });
    // ✅ user가 없으면 즉시 오류 반환
    if (!user) {
        res.status(401).json({ error: "이메일 또는 비밀번호가 틀렸습니다." });
        return;
    }
    // ✅ 비밀번호 검증
    const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ error: "이메일 또는 비밀번호가 틀렸습니다." });
        return;
    }
    // 세션 생성
    req.session.userId = user.id;
    res.json({ success: true, email: user.email });
}));
exports.default = router;
