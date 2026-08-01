# 코드 패턴

## 1. 데이터 탐색

글을 쓰기 전에 항상 실행한다. 기억에 의존한 수치는 이 사이트에서 가장 치명적인 오류다.

```bash
# 전체 로드 후 탐색
node -e "
const fs=require('fs');
const all=fs.readdirSync('data/countries')
  .map(f=>JSON.parse(fs.readFileSync('data/countries/'+f,'utf8')));
console.log('총', all.length, '개국');
console.log(Object.keys(all[0]).join(', '));
"
```

카탈로그는 전 세계 195개국이 아니라 이 사이트가 다루는 나라들(현재 23개국)뿐이다. "N개국"처럼 개수를 제목에 못 박기 전에 반드시 쿼리 결과 개수를 확인할 것 — 기대한 개수보다 적게 나오면 제목과 앵글을 실측치에 맞춰 조정한다 (아래 "데이터가 계획을 바꾼다" 참고).

### 자주 쓰는 쿼리

**기준국 대비 필터 + 정렬**
```js
const kr = all.find(c => c.iso2 === 'KR');
const larger = all
  .filter(c => c.area_km2 > kr.area_km2)
  .sort((a, b) => b.area_km2 - a.area_km2);
```

**결측값 제외 (0으로 대체 금지)**
```js
const withGdp = all.filter(c => c.gdp_per_capita_usd?.value != null);
const excluded = all.length - withGdp.length;
// excluded는 글에 명시한다
```

**월별 기온 조건**
```js
// 1월 최고기온 25도 이상
const warmInJan = all.filter(c => c.climate?.temp_high_c?.[0] >= 25);
```

**기후 유사도 (12개월 배열 거리)**
```js
const dist = (a, b) => Math.sqrt(
  a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0)
);
const similar = all
  .filter(c => c.iso2 !== 'KR' && c.climate?.temp_high_c)
  .map(c => ({ c, d: dist(c.climate.temp_high_c, kr.climate.temp_high_c) }))
  .sort((a, b) => a.d - b.d)
  .slice(0, 10);
```

**그룹핑 (enum 필드)**
```js
const byPlug = {};
all.forEach(c => c.electricity?.plugs?.forEach(p => {
  (byPlug[p] ??= []).push(c);
}));
```

각 국가 JSON의 `sources` 필드에 필드별 출처(name/url/retrieved)가 이미 들어있다. 새 리포트의 `sources` 배열을 쓸 때 이 값을 그대로 재사용할 수 있다 — 특히 `area`, `population`, `gdp_*` 필드는 거의 항상 여기서 가져오면 된다.

---

## 2. 리포트는 페이지가 아니라 데이터다

가이드/리포트마다 새 라우트나 `.tsx` 파일을 만들지 않는다. 렌더링은 이미 두 개의 공용 템플릿이 담당한다:

- `src/app/[locale]/reports/page.tsx` — 목록
- `src/app/[locale]/reports/[slug]/page.tsx` — 상세 (모든 리포트가 이 템플릿 하나를 공유)

할 일은 `data/reports/{slug}.json` 파일 하나를 스키마(`src/lib/reportSchema.ts`)에 맞게 작성하는 것뿐이다.

```json
{
  "slug": "countries-larger-than-south-korea",
  "publishedAt": "2026-08-01",
  "readingMinutes": 5,
  "coverArt": "area-comparison",
  "tags": { "ko": ["면적", "데이터 분석"], "en": ["Area", "Data Deep-Dive"] },
  "title": { "ko": "...", "en": "..." },
  "excerpt": { "ko": "...(숫자 포함)...", "en": "...(a number)..." },
  "stats": [
    { "label": { "ko": "...", "en": "..." }, "value": { "ko": "...", "en": "..." } }
  ],
  "sections": [
    {
      "heading": { "ko": "...", "en": "..." },
      "body": { "ko": ["문단1", "문단2"], "en": ["paragraph 1", "paragraph 2"] }
    }
  ],
  "sources": [
    { "name": "World Bank Open Data", "url": "https://data.worldbank.org", "retrieved": "2026-07" }
  ],
  "relatedCountrySlugs": ["south-korea", "canada", "china"]
}
```

`npm run` 스크립트나 별도 CLI 없이, 이 JSON 파일을 `data/reports/`에 두면 `getAllReports()` / `getReport(slug)` (`src/lib/reports.ts`)가 자동으로 읽어서 목록과 상세 페이지에 반영한다. 캐시는 모듈 레벨 `Map`이라 개발 서버를 재시작해야 반영되는 경우가 있다 (`npm run build`는 항상 새로 읽는다).

**`body`는 순수 텍스트 배열이다.** 마크다운도, HTML도, 인라인 링크도 렌더링되지 않는다 — 문단은 문단으로만 쓴다. 표나 순위 리스트가 필요하다고 느껴져도 문단 산문으로 풀어 쓸 것 (아래 "3. 국가 링크" 참고 — 링크는 본문이 아니라 `relatedCountrySlugs`가 담당한다).

---

## 3. 국가 링크 (양방향)

리포트의 핵심 가치는 국가 상세 페이지로의 링크다. 본문 문단 안에는 링크를 넣을 수 없으므로, 언급한 국가의 슬러그를 전부 `relatedCountrySlugs`에 담는다:

```json
"relatedCountrySlugs": ["south-korea", "canada", "china", "netherlands"]
```

`src/app/[locale]/reports/[slug]/page.tsx`가 이 배열을 읽어 `getCountry(slug)` (`src/lib/countries.ts`)로 각 나라 이름을 찾고, `/{locale}/country/{slug}` 링크 칩 섹션을 렌더링한다. 슬러그가 `data/countries/`에 없는 파일이면 조용히 건너뛰므로 (404를 만들진 않지만), 발행 전에 `npm run build` 결과나 아래 검증 단계에서 오탈자를 직접 확인해야 한다.

**역방향 링크(국가 → 리포트)는 아직 구현돼 있지 않다.** 국가 상세 페이지에 "이 나라가 등장한 리포트" 같은 섹션이 없다면, 그건 만들어야 할 대상이지 이미 있는 척 넘어갈 부분이 아니다 — 리포트가 15편으로 늘면 이 역링크가 없다는 게 SEO 가치의 절반을 깎아먹는다.

---

## 4. 커버 아트

`coverArt`는 `reportCoverArtSchema` (`src/lib/reportSchema.ts`)에 등록된 문자열 enum 값이어야 하고, 실제 그림은 `src/components/reports/ReportCoverArt.tsx`의 `artByVariant` 딕셔너리에 매칭되는 컴포넌트가 있어야 한다.

기존 리포트가 쓰는 시각 언어: `viewBox="0 0 480 320"` 고정 캔버스, 큰 사각형(대상) + 작은 사각형(비교 기준) 오버레이, 국기 이모지, 아래쪽에 값 라벨, 오른쪽에 배수(`×99.6` 같은) 텍스트. 새 variant를 추가할 때 이 패턴을 그대로 따르면 사이트 전체 톤이 흐트러지지 않는다.

**480×320 캔버스는 3:2 비율이고, 이 비율이 사이트 전체의 계약이다.** 홈페이지 리포트 목록, 리포트 상세 페이지 헤더 등 `ReportCoverArt`를 렌더링하는 모든 곳은 `className="aspect-[3/2] w-full"`처럼 **가로세로 비율로** 크기를 지정해야 하며, `h-28`이나 `h-56 sm:h-72`처럼 뷰포트에 따라 실제 렌더링 비율이 3:2에서 벗어나는 고정 높이 클래스를 쓰면 안 된다. 컨테이너 비율이 캔버스 비율과 어긋나면 `preserveAspectRatio="xMidYMid meet"`(현재 설정) 때문에 여백이 생기거나, 예전처럼 `slice`였다면 아래쪽 라벨이 통째로 잘려나간다 — 새 variant를 추가할 때도 이 480×320 캔버스 안에 모든 요소(국기, 라벨, 배수 텍스트)가 들어가도록 배치하고, 사용처에 새 고정 높이 클래스를 넣지 말 것.

```tsx
// src/lib/reportSchema.ts
export const reportCoverArtSchema = z.enum([
  "population-extremes",
  "area-comparison",
  "새-variant-이름",  // 추가
]);
```

```tsx
// src/components/reports/ReportCoverArt.tsx
const artByVariant: Record<ReportCoverArtVariant, ...> = {
  "population-extremes": PopulationExtremesArt,
  "area-comparison": AreaComparisonArt,
  "새-variant-이름": NewArt,  // 추가
};
```

새 차트 라이브러리는 도입하지 않는다. `src/lib/charts/*` (예: `AreaOverlayChart`)는 국가 비교(`/compare`) 페이지에서 쓰는 인터랙티브 컴포넌트이고, 리포트 커버 아트는 별개의 정적 SVG다 — 필요하면 `src/lib/charts/`의 아이디어(예: 면적을 `sqrt` 스케일로 비교)를 참고하되, 리포트용 아트는 고정 크기 정적 마크업으로 만든다.

---

## 5. 발행 전 검증

```bash
npm run build   # 스키마 검증(zod) + 정적 생성이 한 번에 통과해야 한다
```

`reportSchema`가 `safeParse`에 실패하면 빌드 자체가 에러를 던진다 (`src/lib/reports.ts`의 `loadAll()`) — 어떤 필드가 문제인지 에러 메시지에 나온다.

수동 확인:
- `relatedCountrySlugs`의 모든 슬러그가 `data/countries/*.json`의 파일명과 일치하는지 (빌드된 HTML에서 `grep -o 'href="[^"]*country[^"]*"'`로 직접 확인 가능)
- 산문의 숫자 == 실제 쿼리 결과 숫자 (도입부를 쿼리 확정 전에 쓰면 어긋난다)
- ko/en 두 로케일 모두 `.next/server/app/{locale}/reports/{slug}.html`로 생성됐는지
- `excerpt`에 구체적 숫자가 들어갔는지 (메타 설명으로 그대로 노출됨)

---

## 6. 분기 데이터 갱신 후

`data/countries/*.json`이 바뀌면 이미 발행된 리포트 본문 속 숫자가 낡는다. 자동으로 안 고쳐진다 — 대조해주는 스크립트가 아직 없으므로, 리포트 수가 늘면 (예: 5편 이상) 각 리포트가 인용한 수치를 재쿼리해서 대조하는 스크립트를 `scripts/`에 만드는 걸 고려할 것. 그 전까지는 "기존 가이드 업데이트해줘" 요청이 오면 수동으로 재쿼리 → 대조 → 수정한다.
