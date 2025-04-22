// config/env.ts
import dotenv from "dotenv";

// NODE_ENV 값이 명시적으로 없으면 기본값을 'development'로 설정
const NODE_ENV = process.env.NODE_ENV || "development";

// 환경에 따라 로드할 파일 결정
const envFile = NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

// 공통으로 사용하는 플래그 export
// export const isProd = NODE_ENV === "production";
// export const isDev = NODE_ENV === "development";
// export const isTest = NODE_ENV === "test";

console.log(`🧪 현재 NODE_ENV: ${NODE_ENV}`);
console.log(`📄 로드된 환경파일: ${envFile}`);
