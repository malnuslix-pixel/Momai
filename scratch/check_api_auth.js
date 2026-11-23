const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      res.push(...walk(p));
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      res.push(p);
    }
  }
  return res;
}

for (const f of walk('src/app/api')) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('ADMIN_') || content.includes('SECRET_KEY') || content.includes('passphrase') || content.includes('auth')) {
    console.log(f);
  }
}
