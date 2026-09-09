# 📄 강민기 (Mingi Kang) | Web Resume & Portfolio

> **실시간 통신 및 클라우드 AI 서비스 파이프라인 구축 역량을 갖춘 소프트웨어 엔지니어**  
> 🌐 **Live Web Resume:** [https://miminzku.github.io/resume/](https://miminzku.github.io/resume/)

---

## ✨ Features
1. **직무 맞춤형 탭 필터 (Role-based Dynamic View)**
   - `전체 마스터` / `AI 서비스 개발자` / `보안 솔루션 엔지니어` / `클라우드 엔지니어` 탭 지원
   - 선택한 직무에 따라 **소개글 및 프로젝트 우선순위 자동 재정렬**
2. **완벽한 A4 PDF 출력 지원 (`@media print`)**
   - 불필요한 웹 UI(버튼, 탭 컨트롤러) 자동 숨김
   - 프로젝트 카드 잘림 방지(`page-break-inside: avoid`) 및 A4 규격 마진 최적화
3. **간편한 데이터 관리 (Data-Driven)**
   - 모든 이력서 텍스트가 [`src/data/resumeData.json`](./src/data/resumeData.json) 하나로 관리됨
   - 깃허브 웹 에디터에서 JSON만 수정하고 커밋하면 CI/CD가 1분 만에 자동 빌드/배포

---

## 🛠 Tech Stack
- **Frontend:** React 19, Vite, Vanilla CSS (Pretendard Font)
- **Deployment & CI/CD:** GitHub Pages, GitHub Actions
- **Data Architecture:** Single Source of Truth (`resumeData.json`)

---

## 🚀 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드 테스트
npm run build
```

---

## ✏️ 이력서 내용 수정 방법
1. [`src/data/resumeData.json`](./src/data/resumeData.json) 파일을 깃허브 웹 화면에서 엽니다.
2. 우측 상단 연필 아이콘(`Edit`)을 눌러 텍스트를 수정합니다.
3. 하단의 **Commit changes**를 누르면 GitHub Actions가 자동으로 사이트를 재배포합니다.
