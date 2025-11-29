# 🔍 API DevTools

[![CI](https://github.com/seyun31/api-devtools/actions/workflows/ci.yml/badge.svg)](https://github.com/seyun31/api-devtools/actions/workflows/ci.yml)

> API 요청을 캡처하고, 테스트부터 코드 변환까지 한 흐름으로 이어주는 올인원 CLI 도구

---

### 🎯 문제 정의

- API 오류가 발생했을 때, 동일한 조건을 다시 재현해야만 분석할 수 있어 많은 시간을 소모합니다.
- DevTools에서 확인한 요청을 그대로 복사하거나 공유하기 어렵기 때문에, 문제 분석과 협업 과정이 자주 끊기곤 합니다.
- API 요청을 테스트 코드, curl, fetch, axios 등으로 변환하는 작업은 수동으로 진행해야 하며 반복적이고 비효율적입니다.  
<br/>

➡️ 개발 환경을 벗어나지 않고 API 디버깅 과정에서 발생한 오류 상황을 캡처/저장하며, 요청 테스트부터 코드 변환까지를 한 흐름으로 이어주는 CLI 도구입니다!

---

### 🚀 설치

```bash
# 전역 설치
npm install -g @seyun31/api-devtools

# npx 사용 (권장)
npx @seyun31/api-devtools

# 로컬 설치
npm install @seyun31/api-devtools
```

---

### 💡 기본 사용법

#### 1️⃣ 프로그램 실행

```bash
npx @seyun31/api-devtools
```

실행하면 다음 4가지 메뉴가 나타납니다:

```
📨 API 테스트 실행
🔍 API 요청 모니터링
💾 저장된 요청 관리
❓ 도움말
```

---

#### 2️⃣ API 테스트 실행

```
? 어떤 작업을 하시겠어요? 📨 API 테스트 실행
? 요청 방식을 선택해주세요: GET
? URL을 입력해주세요: https://jsonplaceholder.typicode.com/posts/1
? 헤더를 추가하시겠어요? No

🚀 GET https://jsonplaceholder.typicode.com/posts/1 요청 중...


 🔍 API DevTools

 GET https://jsonplaceholder.typicode.com/posts/1

 상태: ✓ 200 OK
 응답 시간: 238ms
 크기: 292B

 응답:
 ┌───────────────────────────────────────────────────────────┐
 │                                                           │
 │ {                                                         │
 │   "userId": 1,                                            │
 │   "id": 1,                                                │
 │   "title": "sunt aut facere repellat...",                 │
 │   "body": "quia et suscipit\nsuscipit recusandae..."      │
 │ }                                                         │
 │                                                           │
 └───────────────────────────────────────────────────────────┘


 ┌───────────────────────────────────────────────────────────┐
 │                                                           │
 │ F: 전체 응답 보기/접기 | C: 코드 생성 | S: 저장 | Q: 종료          |
 │                                                           │
 └───────────────────────────────────────────────────────────┘
```

---

#### 3️⃣ API 요청 모니터링 (프록시 모드)

```
? 어떤 작업을 하시겠어요? 🔍 API 요청 모니터링
? 프록시할 대상 서버 주소를 입력해주세요: http://localhost:3000

🚀 프록시 서버를 시작합니다...
📡 http://localhost:8888 → http://localhost:3000

💡 앱의 API 주소를 http://localhost:8888로 설정하세요


 🔍 API DevTools
 ⚡ 8888번 포트에서 대기 중...
 📡 프록시: localhost:8888 → http://localhost:3000

 ━━ 네트워크 ━━
 메서드  URL                      상태    크기    시간
 ──────────────────────────────────────────────────────
 GET     /api/users               200     1.2KB   125ms
❯POST    /api/login               201     456B    342ms
 GET     /api/profile             200     892B    89ms


 ━━ 상세 정보 ━━

 일반
 URL: /api/login
 메서드: POST
 상태: 201 Created
 응답 시간: 342ms
 크기: 456B

 요청 헤더
 host: localhost:3000
 content-type: application/json
 accept: application/json

 타이밍
 대기 (TTFB): 320ms
 컨텐츠 다운로드: 22ms
 전체: 342ms

 ┌──────────────────────────────────────────────────────┐
 │                                                      │
 │ S: 저장 | Q: 종료                                      |
 │                                                      │
 └──────────────────────────────────────────────────────┘
```

---

#### 4️⃣ 저장된 요청 관리

```
? 저장된 요청 목록: (Use arrow keys)
❯ POST-1701234567890 (POST https://api.example.com/login)
  GET-1701234567891 (GET https://api.example.com/users)
  ← 메인 메뉴로

? 작업 선택: (Use arrow keys)
❯ ▶️  실행
  🗑️  삭제
  ← 뒤로가기
```

---

#### 5️⃣ 코드 생성 기능

API 테스트 결과 화면에서 `C` 키를 누르면:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
코드 생성기
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET https://jsonplaceholder.typicode.com/posts/1

코드 타입을 선택하세요:
1. curl 명령어
2. fetch API
3. axios
4. 테스트 코드 생성
```

fetch/axios 선택 시:
```
언어를 선택하세요:
1. JavaScript
2. TypeScript
```

테스트 코드 선택 시:
```
테스트 프레임워크를 선택하세요:
1. Jest
2. Vitest
```

생성된 코드 예시:
```
 코드 생성기

 GET https://jsonplaceholder.typicode.com/posts/1

 생성된 코드:

 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │ import type { AxiosResponse, AxiosError } from 'axios';  │
 │                                                          │
 │ interface ResponseData {                                 │
 │   // TODO: Define response type                          │
 │ }                                                        │
 │                                                          │
 │ axios<ResponseData>({                                    │
 │   method: 'GET',                                         │
 │   url: 'https://jsonplaceholder.typicode.com/posts/1',   │
 │   headers: {                                             │
 │     'Content-Type': 'application/json'                   │
 │   }                                                      │
 │ })                                                       │
 │   .then((response: AxiosResponse<ResponseData>) =>       │
 │     console.log(response.data))                          │
 │   .catch((error: AxiosError) => console.error(error));   │
 │                                                          │
 └──────────────────────────────────────────────────────────┘

 클립보드에 복사하려면 터미널에서 직접 선택하세요

 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │ B: 뒤로 | Q: 종료                                          │
 │                                                          │
 └──────────────────────────────────────────────────────────┘
```

---

### 🛠️ 개발 & 품질 보증

- **빌드 환경**
  - `TypeScript` 기반으로 개발되었으며, `npm run build`를 통해 `dist/` 디렉토리에 JavaScript로 트랜스파일됩니다.
  - CLI 실행을 위한 `bin` 설정이 되어 있으며, 실제 배포 시 실행 파일이 `dist/cli.js`로 출력됩니다.

- **Lint & Format**
```bash
npm run lint # ESLint 검사
npm run format # Prettier 자동 포맷
```

- **테스트**
```bash
npm test # Vitest 유닛 테스트 실행
```

- **CI/CD**

  1️⃣ `npm ci` 의존성 설치

  2️⃣ `npm run lint` 코드 스타일 검사

  3️⃣ `npm run build` TypeScript 빌드

  4️⃣ `npm test` Vitest 유닛 테스트

