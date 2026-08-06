
#!/bin/bash

KEY="e86c1433bfc0856f731e16cbb5763606"

HOST="whatsthepop.world"

CSV="$1"

LIMIT="${2:-200}"

if [ ! -f "$CSV" ]; then

  echo "CSV 파일을 찾을 수 없음: $CSV"

  exit 1

fi

SELECTED=$(tail -n +2 "$CSV" | cut -d',' -f1 | tr -d '"' | grep '^https' | head -n "$LIMIT")

COUNT=$(echo "$SELECTED" | grep -c .)

if [ "$COUNT" -eq 0 ]; then

  echo "URL을 찾지 못함."

  exit 1

fi

JSON=$(echo "$SELECTED" | sed 's/.*/"&"/' | paste -sd, -)

BODY="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"urlList\":[$JSON]}"

echo "제출할 URL: $COUNT 개"

echo "$SELECTED" | head -3

echo "..."

curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" --data-raw "$BODY" -w "\nHTTP %{http_code}\n"

