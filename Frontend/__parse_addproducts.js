const fs = require('fs');
const parser = require('@babel/parser');
const code = fs.readFileSync('src/pages/Admin/AddProducts.jsx', 'utf8');
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  console.log('PARSE_OK');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
