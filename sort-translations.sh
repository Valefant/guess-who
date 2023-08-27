#!/usr/bin/env sh

languages="en-US de"
for language in $languages; do
  path="src/i18n/$language"
  old_file_path="$path/index.ts"
  new_file_path="$path/index-new.ts"
  touch $new_file_path
  echo -n 'export default ' > $new_file_path
  node sort-keys.js $language | jq -S >> $new_file_path
  npx prettier --write $new_file_path
  mv $new_file_path $old_file_path
done
