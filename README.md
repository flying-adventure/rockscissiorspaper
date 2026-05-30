# Rock Paper Scissors ✊🤚✌

웹캠으로 손 제스처를 인식해서 플레이하는 실시간 가위바위보 게임.  
TensorFlow.js Handpose 모델로 손 관절을 추적하고, Fingerpose로 제스처를 분류합니다.

> 초등학생·어린이 대상 / 전시·교육 환경 최적화

**배포 주소:** https://whoisthewinnerofthisgame.netlify.app/

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Language | Vanilla JavaScript (ES6) |
| Build | Webpack 5 |
| Style | SCSS, PostCSS |
| AI/ML | TensorFlow.js (`@tensorflow-models/handpose`), Fingerpose |
| Sound | Howler.js |
| Code Quality | ESLint (airbnb-base), Prettier, Babel |

---

## 주요 기능

- **실시간 손 제스처 인식** — 웹캠 영상을 TensorFlow.js Handpose 모델로 분석, 손 21개 관절 좌표 추출
- **제스처 분류** — Fingerpose로 바위(✊) / 보(🤚) / 가위(✌) 인식
- **AI 상대** — 랜덤 무브로 대응하는 로봇 캐릭터
- **카운트다운 타이머** — SVG 원형 타이머로 제스처 인식 시간 시각화
- **승패 효과음** — Howler.js로 win / lose / click 사운드 재생
- **닉네임 시스템** — 플레이어 이름 입력 및 로봇 인사 메시지 표시
- **모바일 감지** — `navigator.userAgent` 기반 모바일 디바이스 분기 처리

---

## 설치 및 실행

### 사전 요구사항
- Node.js 설치

### 설치

```bash
git clone https://github.com/flying-adventure/rockscissiorspaper.git
cd rockscissiorspaper
npm install
```

### 개발 서버

```bash
npm run start
```

브라우저에서 http://localhost:8080 접속 후 웹캠 권한 허용

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

---

## 디렉토리 구조

```
rockscissiorspaper/
├── src/
│   ├── index.js              # 진입점 — 게임 초기화 및 루프
│   ├── template.html
│   ├── js/
│   │   ├── CameraConfig.js   # 웹캠 설정
│   │   ├── Gestures.js       # 바위·보·가위 제스처 정의 (Fingerpose)
│   │   ├── Prediction.js     # Handpose 모델 로드 및 제스처 예측
│   │   ├── SampleImage.js    # 모델 워밍업용 샘플 이미지
│   │   └── UI.js             # DOM 업데이트 (타이머, 손 이미지, 메시지 등)
│   ├── styles/
│   │   ├── index.scss
│   │   ├── _game.scss
│   │   └── _variables.scss
│   ├── sounds/               # win / lose / click 효과음
│   └── fonts/                # 8BIT WONDER 픽셀 폰트
├── config/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── docs/                     # GitHub Pages 배포 빌드
└── public/                   # 정적 이미지 에셋 (rock, paper, scissors, robot)
```

---

## 기여자

| 이름 | 역할 |
|------|------|
| Soobin (@flying-adventure) | 프로젝트 리드, AI 연동, 게임 로직, UI/UX 디자인 |
| Taeyoung (@taeyoungHan-right) | CSS/SCSS 스타일, 사운드, 디자인 개선 |
