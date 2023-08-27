#!/usr/bin/env sh

if [ -z $(which jq 2>/dev/null) ]; then
  echo 'jq is required'
  exit 1
fi

languages="en-US de"
for language in $languages; do
  file_path="src/i18n/$language.json"
  jq -S . $file_path > "$file_path-tmp"
  mv "$file_path-tmp" $file_path
done
