# Church Team App

교회 팀 관리 시스템 — 팀원 관리, 공지 발송, 출석 응답을 웹에서 처리할 수 있는 서비스입니다.

**Live:** https://church-team-app.vercel.app

---

## 주요 기능

### 역할 기반 접근 (3가지 역할)

| 역할 | 권한 |
|------|------|
| **Admin** | 회원가입 승인/거절, 유저 관리, 팀 생성 및 리더 배정 |
| **Leader** | 담당 팀 멤버 조회, 공지 작성, 출석 결과 확인 |
| **Member** | 공지 수신, YES/NO 출석 응답 |

### 인증 흐름
1. 회원가입 요청 → Admin이 승인해야 로그인 가능
2. 로그인 후 역할에 따라 자동으로 해당 대시보드로 이동

---

## 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **Auth / DB**: Firebase Authentication + Firestore
- **Deployment**: Vercel

---

## 로컬 개발 환경 설정

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해서 `.env.local`을 만들고 Firebase 프로젝트 값을 입력하세요.

```bash
cp .env.example .env.local
```

`.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

---

## 프로젝트 구조

```
src/
├── app/
│   ├── login/         # 로그인 페이지
│   ├── signup/        # 회원가입 페이지
│   ├── admin/         # 관리자 페이지 (dashboard, users, teams, requests)
│   ├── leader/        # 리더 페이지 (dashboard, announcements, results)
│   └── member/        # 멤버 페이지 (home)
├── components/
│   ├── ProtectedRoute.js   # 역할 기반 라우트 보호
│   ├── AdminSidebar.js
│   ├── LeaderSidebar.js
│   └── MemberSidebar.js
└── lib/
    ├── firebase.js    # Firebase 초기화
    └── auth.js
```
