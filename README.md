# OL' THAT GIRL 인생네컷 · Vercel 배포 버전

컴퓨터 웹캠으로 4컷을 찍으면 사진이 인터넷에 업로드되고, **어디서든** (같은 Wi-Fi가 아니어도)
QR을 스캔해서 폰으로 사진을 받을 수 있는 버전이에요. 사진 저장은 Vercel Blob(Vercel이 제공하는
파일 저장소)을 사용해요.

## 폴더 구조
```
photobooth-vercel/
├── api/
│   └── upload.js      ← 사진을 Vercel Blob에 올리는 서버리스 함수
├── public/
│   └── index.html     ← 네컷 촬영 페이지
└── package.json
```

## 배포 방법

### 1. GitHub에 올리기
이 폴더를 새 GitHub 저장소로 push 하세요. (Vercel CLI로 바로 배포해도 되지만,
GitHub 연동이 이후 관리가 훨씬 편해요.)

### 2. Vercel에서 새 프로젝트 만들기
1. https://vercel.com → **Add New → Project**
2. 방금 만든 GitHub 저장소 선택 → **Deploy**
   (Framework Preset은 "Other"로 자동 감지돼요. 별도 설정 필요 없음)

### 3. Vercel Blob 스토리지 연결 (★ 이 단계가 핵심)
1. 배포된 프로젝트 → **Storage** 탭 → **Create Database** → **Blob** 선택
2. Store 이름 정하고 생성 → 프로젝트에 자동 연결
3. 연결하면 `BLOB_READ_WRITE_TOKEN` 환경변수가 프로젝트에 **자동으로** 추가돼요
   (직접 복사/붙여넣기 안 해도 됨)
4. **Deployments** 탭에서 최신 배포를 **Redeploy** 한 번 해주세요
   (환경변수는 재배포해야 함수에 반영돼요)

### 4. 확인
1. 배포된 주소(`https://your-project.vercel.app`)로 접속
2. 카메라 권한 허용 → 4컷 촬영 → 프레임 완성
3. 화면에 뜨는 QR을 폰으로 스캔 → 사진이 바로 열리거나 다운로드됨

## 참고
- 사진은 `public` 접근 권한으로 Vercel Blob에 저장돼요. 즉 **링크를 아는 사람은 누구나** 볼 수 있어요.
  링크 자체는 추측하기 어려운 랜덤 문자열이지만, 완전 비공개가 필요하면 `api/upload.js`의
  `access: 'public'`을 `'private'`으로 바꾸고 별도 인증 로직을 추가해야 해요.
- 무료(Hobby) 플랜 기준 Blob은 매달 무료 제공량이 있어요. 트래픽이 많아지면 Vercel 대시보드에서
  사용량을 확인하세요.
- 업로드 용량 제한(Vercel 플랫폼 한도)은 요청당 4.5MB예요. 지금 코드는 합성된 이미지를 JPEG로
  압축해서 올리기 때문에 이 한도 안에 넉넉히 들어가요.
- 오래된 사진을 정리하고 싶으면 Vercel 대시보드 **Storage → Blob → 파일 선택 → Delete**로
  지울 수 있어요.
