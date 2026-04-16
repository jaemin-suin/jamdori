# GitHub Pages 배포 안내

이 폴더(`calendar-app`)에는 정적 웹 앱이 준비되어 있습니다.

## 배포 전제 조건
- `git`이 설치되어 있어야 합니다.
- GitHub 계정이 있어야 합니다.
- GitHub 레포지토리를 생성해야 합니다.

## 기본 배포 절차
1. GitHub에 새 레포지토리를 만듭니다.
2. 로컬에서 `calendar-app` 폴더로 이동합니다.
3. 아래 명령을 실행합니다:

```bash
cd c:\Users\USER\.vscode\calendar-app
git init
git add .
git commit -m "Initial calendar app"
git branch -M main
git remote add origin https://github.com/<사용자이름>/<레포지토리명>.git
git push -u origin main
```

4. GitHub 리포지토리 설정에서 `Pages`를 선택합니다.
5. 소스(Source)를 `main` 브랜치의 `root`로 설정합니다.
6. 저장 후, GitHub Pages가 주소를 생성합니다.

## 예상 URL
- `https://<사용자이름>.github.io/<레포지토리명>/`

## 참고
- 현재 이 작업 환경에는 `git`과 `python`, `node` 같은 배포 도구가 설치되어 있지 않아 자동 배포는 불가능합니다.
- 필요하시면 설치 후 `DEPLOYMENT.md` 내용을 따라 공개 URL을 바로 만들 수 있습니다.
