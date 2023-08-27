const fs = require('fs');

function requireFromString(src, filename) {
  const Module = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m.exports;
}

const language = process.argv[2];
const i18n = fs.readFileSync(`src/i18n/${language}/index.ts`, {
  encoding: 'utf8',
  flag: 'r',
});

const commonJsCompatibleTranslations = i18n.replace(
  'export default',
  'module.exports =',
);
const obj = requireFromString(commonJsCompatibleTranslations, '');

console.log(JSON.stringify(obj));
