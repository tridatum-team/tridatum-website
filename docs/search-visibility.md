# 홈페이지 검색 노출 관리

2026년 11월 13일 기준으로 회사 이름인 트라이데이텀과 Tridatum을 검색할 때 홈페이지를 찾을 수 있도록 기술 설정과 검색 관리 도구 등록을 진행합니다. 대표 주소는 https://tridatum.co/ 입니다. 검색 등록이나 수집 요청은 검색 노출 및 순위를 보장하지 않습니다.

## 최신 소스 확인

GitHub `8f1a468` 이후 운영에 반영된 11월 13일 개편 원본을 확인해 저장소에 동기화했습니다. 이전 Pages 배포는 `edd9d15d-e43e-4b68-be10-639484144679`이며 원본 공개 파일 23개를 운영 응답과 대조했습니다. 21개는 동일했고 문의·개인정보 페이지의 차이는 Cloudflare 이메일 보호 처리였습니다. 기존 Worker 원본도 함께 보존했으며 이번 검색 최적화에서는 Worker를 재배포하지 않습니다.

## 홈페이지 보완

- 공개 페이지 6개의 제목·설명과 Open Graph 이름을 정리했습니다.
- 메인에 트라이데이텀, Tridatum, TRIDATUM 회사명과 WebSite 구조화 데이터를 추가했습니다.
- canonical 및 사이트맵의 주소를 Cloudflare가 실제 제공하는 확장자 없는 주소로 맞췄습니다.
- 공개 파일 전용 빌드를 추가하고 메뉴·푸터를 서버에서 전달되는 HTML에 포함했습니다.
- robots.txt의 공개 페이지 수집 허용 및 관리자 경로 제외를 유지했습니다.

## 계정과 인증이 필요한 작업

| 서비스 | 남은 작업 | 필요한 정보 또는 접근 |
| --- | --- | --- |
| 네이버 서치어드바이저 | 기존 등록 확인, 소유확인, 사이트맵 제출, 수집 요청 | 회사 사이트를 관리할 네이버 계정 로그인 |
| Google Search Console | 기존 속성 확인, 소유확인, 사이트맵 제출, URL 검사 | 회사 사이트를 관리할 Google 계정 로그인 |
| 다음 웹마스터도구 | PIN 인증, robots.txt 인증 줄 반영, 사이트맵 제출 | 기존 PIN 또는 사용자가 직접 새 PIN 설정 및 이용동의 |
| Cloudflare | www.tridatum.co에서 tridatum.co로 영구 이동 | Redirect Rules 수정 권한이 있는 대시보드 로그인 |
| 지도 서비스 | 중복 등록 및 사업장 등록 자격 확인, 신청 | 관리 계정, 사업장 주소, 공개 연락처, 필요한 증빙 및 본인인증 |

Cloudflare의 현재 CLI 연결은 Pages 배포가 가능하지만 Redirect Rules 조회에서 403 권한 오류를 반환했습니다. Pages의 `_redirects` 파일은 도메인별 이동을 지원하지 않으므로 모든 호스트를 잘못 이동시키는 규칙으로 대체하지 않습니다.

다음 새 PIN 입력과 이용동의는 사용자가 직접 처리합니다. 비밀번호와 PIN은 저장소나 채팅에 기록하지 않습니다. 네이버·구글 인증 태그와 다음 robots.txt 인증 줄은 발급 화면을 확인한 뒤 필요한 공개 검증 값만 반영합니다.

지도 등록은 홈페이지 검색 등록과 별개입니다. Google 비즈니스 프로필은 고객 방문 또는 직접 방문 서비스 등 실제 운영 요건을 먼저 확인합니다. 주소·영업시간·간판·방문 가능 여부는 추측해 입력하지 않습니다.

## 제출할 주소

- 사이트: https://tridatum.co/
- 사이트맵: https://tridatum.co/sitemap.xml
- 주요 페이지: `/`, `/services`, `/work`, `/about`, `/contact`

## 확인 근거

- 네이버 검색 최적화: https://searchadvisor.naver.com/guide/seo-basic-intro
- Google 소유권 확인: https://support.google.com/webmasters/answer/9008080?hl=ko
- 회사 구조화 데이터: https://developers.google.com/search/docs/appearance/structured-data/organization
- Cloudflare Pages 이동 규칙: https://developers.cloudflare.com/pages/configuration/redirects/
- Google 사업장 등록 기준: https://support.google.com/business/answer/3038177?hl=ko
