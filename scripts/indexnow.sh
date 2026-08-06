#!/bin/bash
KEY="e86c1433bfc0856f731e16cbb5763606"
HOST="whatsthepop.world"

# 인자로 받은 URL들을 JSON 배열로 변환
URLS=$(printf '"%s",' "$@" | sed 's/,$//')

curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"$HOST\",
    \"key\": \"$KEY\",
    \"urlList\": [$URLS]
  }" -w "\nHTTP %{http_code}\n"
