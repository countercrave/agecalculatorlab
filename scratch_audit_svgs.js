const fs = require('fs');
const path = require('path');

function getSvgs(dir) {
  let list = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) list = list.concat(getSvgs(full));
    else if (f.endsWith('.svg')) list.push(full);
  });
  return list;
}

const allSvgs = getSvgs('assets/articles');
console.log('Total SVGs in assets/articles:', allSvgs.length);

allSvgs.forEach(svgPath => {
  const content = fs.readFileSync(svgPath, 'utf8');
  
  // 1. Multi value rx/ry
  const multiRx = content.match(/r[xy]="[^"]+\s+[^"]+"/g);
  if (multiRx) {
    console.log('[ERROR] Multi-value rx/ry in ' + svgPath + ':', multiRx);
  }

  // 2. Unescaped ampersand
  const unescapedAmp = content.match(/&(?!(amp|lt|gt|quot|apos);)/g);
  if (unescapedAmp) {
    console.log('[ERROR] Unescaped ampersand in ' + svgPath + ':', unescapedAmp.length);
  }

  // 3. Invalid height="auto" or width="auto" in <svg> tag
  const svgTag = content.match(/<svg[^>]*>/);
  if (svgTag) {
    if (svgTag[0].includes('height="auto"') || svgTag[0].includes('width="auto"')) {
      console.log('[WARN] height/width="auto" in <svg> tag in ' + svgPath + ':', svgTag[0]);
    }
  }
});
