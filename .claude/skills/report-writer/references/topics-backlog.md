# 가이드 주제 백로그

**규칙:** 3일에 1편. 발행 후 `status`, `published`, `slug`, `intro_shape`를 반드시 기록한다.
`intro_shape`는 다음 편에서 같은 형태를 피하기 위한 기록이다 (형태 정의는 `voice-and-style.md` 참조).

---

## P1 — 검색 수요 높음, 먼저 처리

### 1. 한국보다 큰 나라 30개국
- slug: `countries-larger-than-south-korea`
- status: published (2026-08-01)
- 데이터: `area_km2` 필터 + 정렬
- 형태: 순위 목록 + 실루엣 오버레이 SVG
- 각도 힌트: 순위 하위권 나라도 한국의 몇 배인지가 놀라운 지점. 한국의 세계 면적 순위 자체도 함께
- 영어판 각도: 기준국을 미국/영국으로 바꾼 별도 페이지가 아니라, 같은 글에서 독자 본국 기준 비교 위젯으로 연결
- 실제 발행 노트: 카탈로그가 23개국뿐이라 "30개국"은 데이터가 뒷받침하지 못함 — 22개국 중 20곳이 한국보다 크고 작은 나라는 네덜란드·스위스 단 둘뿐이라는 실제 분포로 앵글을 바꿔서 발행. "30개국" 프레이밍이 필요하면 데이터셋이 커진 뒤 재검토.

### 2. 월별 기온으로 고른 여행지 캘린더
- slug: `best-months-to-travel`
- status: todo
- 데이터: `climate.temp_high_c` 12개월 배열
- 형태: 12개월 그리드 (순위 목록 아님)
- 각도 힌트: "1월에 따뜻한 곳" 같은 계절 역전 수요. 한국 겨울 = 남반구 여름
- 시즌: 봄(3~4월) 또는 연말에 발행하면 수요 최대

### 3. 1인당 GDP와 여행 물가: 예산 짜는 법
- slug: `gdp-and-travel-budget`
- status: published (2026-08-03)
- 데이터: `gdp_per_capita_usd` + `currency`
- 형태: 설명 중심 + 소규모 표
- 각도 힌트: **명목 GDP가 여행 물가를 오해하게 만드는 사례**를 주제로. 단순 순위 나열이 아니라 반박형 글
- 실제 발행 노트: 명목 GDP·1인당 GDP 순위가 나라별로 크게 갈리는 지점(중국 명목 2위→1인당 33위, 안도라 명목 꼴찌→1인당 13위)을 축으로 씀. 아일랜드 1인당 1위는 다국적기업 회계 왜곡(GNI* 지표) 캐비엇을 덧붙였고, 가이아나는 최근 해상 유전 개발로 1인당 소득이 급등한 사례로 다룸 — 둘 다 데이터만으로는 안 나오는 문장.

### 4. 영어가 통하는 나라 순위
- slug: `english-speaking-countries`
- status: todo
- 데이터: `languages.english_proficiency`
- 형태: 등급별 그룹핑
- 각도 힌트: 공용어와 실제 통용도의 괴리 (인도, 필리핀, 북유럽)

---

## P2 — 실용 정보형, 공유가 잘 됨

### 5. 전압·플러그 타입 세계 지도
- slug: `plug-types-by-country`
- status: todo
- 데이터: `electricity`
- 형태: 플러그 타입별 그룹 + 아이콘
- 각도 힌트: 여행 준비 검색 수요 꾸준함. 멀티어댑터 하나로 커버되는 범위

### 6. 시차 없이 갈 수 있는 나라
- slug: `same-timezone-countries`
- status: todo
- 데이터: `timezone`
- 형태: 시차별 그룹
- 각도 힌트: 시차 적응이 필요 없는 목적지 = 짧은 휴가에 유리

### 7. 좌측통행 국가 목록
- slug: `left-hand-traffic-countries`
- status: todo
- 데이터: `driving_side`
- 형태: 지도 + 목록
- 각도 힌트: 렌터카 여행자 대상. 국제운전면허 관련 실용 정보 1문장 필수

### 8. 우기·건기로 본 동남아 여행 시기
- slug: `southeast-asia-rainy-season`
- status: todo
- 데이터: `climate.precip_mm` + 지역 필터
- 형태: 국가별 월간 히트맵
- 각도 힌트: 같은 나라 안에서도 지역차가 큼 (태국 남부 동/서해안)

---

## P3 — 흥미 유발형, 백링크 목적

### 9. 인구 밀도 극단 비교
- slug: `population-density-extremes`
- status: todo
- 데이터: `population` / `area_km2`
- 각도 힌트: 밀도 평균이 거짓말하는 사례 (이집트, 캐나다, 아이슬란드 — 거주 가능 면적 기준으로 다시 계산)

### 10. 세계에서 가장 작은 나라 10곳
- slug: `smallest-countries`
- status: todo
- 데이터: `area_km2` 오름차순
- 각도 힌트: 서울 자치구와 비교하면 체감이 살아남

### 11. 한국과 기후가 비슷한 나라
- slug: `countries-with-similar-climate-to-korea`
- status: todo
- 데이터: 12개월 기온 배열 유사도 계산
- 형태: 짝 비교
- 각도 힌트: 사계절이 뚜렷한 나라는 생각보다 적음

### 12. 남반구 여행 가이드 — 계절이 반대인 나라
- slug: `southern-hemisphere-travel`
- status: todo
- 시즌: 10~11월 발행 권장

### 13. 물가가 한국의 절반인 나라
- slug: `cheaper-than-korea`
- status: todo
- 주의: 데이터로 물가를 직접 계산할 수 없음. 1인당 GDP는 대리 지표일 뿐이라는 한계를 명시할 것. 결과가 빈약하면 글의 형태를 "왜 물가 비교가 어려운가"로 전환

### 14. 인구 고령화 순위 — 한국은 몇 위?
- slug: `aging-population-ranking`
- status: todo
- 데이터: `median_age`
- 각도 힌트: 한국 독자 관심 높음. 여행보다 사회 이슈 각도

### 15. 종교 구성으로 본 여행 에티켓
- slug: `religion-and-travel-etiquette`
- status: todo
- 데이터: `religions`
- 주의: 민감 주제. 판단이나 우열 표현 금지. 복장·금식기간·방문 시간 같은 **실용 정보**에만 집중

---

## 발행 기록

| 발행일 | slug | 로케일 | intro_shape | 비고 |
|---|---|---|---|---|
| 2026-07-30 | `population-extremes` | ko/en | D. 대조 병치형 | 이 스킬 워크플로 밖에서 수동 작성됨 (백로그 미기재 상태로 발견, 소급 기록) |
| 2026-08-01 | `countries-larger-than-south-korea` | ko/en | A. 이상치 제시형 | "한국보다 큰 나라 30개국"에서 데이터 실측(22개국 중 20개)에 맞춰 "작은 나라는 단 2곳" 앵글로 전환 |
| 2026-08-03 | `gdp-and-travel-budget` | ko/en | B. 오해 교정형 | 카탈로그가 53개국으로 늘어난 뒤 첫 발행. "경제 대국 = 비싼 나라"라는 통념을 명목/1인당 GDP 순위 격차로 반박. 새 커버아트 variant `gdp-per-capita-gap` 추가 |

---

## 백로그 추가 아이디어 (미확정)

- 무비자 입국 가능 일수 비교 (데이터 소스 확보 필요)
- 국기 색상 통계
- 수도가 최대 도시가 아닌 나라
- 내륙국 목록
- 섬나라 목록
