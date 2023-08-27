#!/usr/bin/env sh

languages="en-US de"
for language in $languages; do
  file_path="src/i18n/$language.json"
  jq -S . $file_path > "$file_path-tmp"
  mv "$file_path-tmp" $file_path
done
