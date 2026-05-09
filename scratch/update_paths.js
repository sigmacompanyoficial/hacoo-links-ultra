const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');
content = content.replace(/slug:\s*"([^"]+)",([^}]+?)image:\s*"[^"]+"/g, 'slug: "$1",$2image: "/products/new/$1/1.jpg"');
fs.writeFileSync('src/data/products.ts', content, 'utf8');
console.log('Replaced images successfully.');
