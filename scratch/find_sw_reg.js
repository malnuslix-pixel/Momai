const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      res.push(...walk(p));
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')) {
      res.push(p);
    }
  }
  return res;
}

for (const f of walk('src')) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('serviceWorker') || content.includes('sw.js')) {
    console.log(`SW in: ${f}`);
  }
}
