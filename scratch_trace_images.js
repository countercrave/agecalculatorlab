const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/PC/.gemini/antigravity/brain/f63ea828-80c5-4e64-98ba-09bd93238e13';
const brainFiles = fs.readdirSync(brainDir).filter(f => f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.png'));

const brainMap = {};
brainFiles.forEach(f => {
  const st = fs.statSync(path.join(brainDir, f));
  brainMap[st.size] = f;
});

function findImages(dir) {
  let list = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) list = list.concat(findImages(full));
    else if (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')) list.push(full);
  });
  return list;
}

const allArticleImages = findImages('assets/articles');

console.log('--- Matching Article Images to Brain Artifacts ---');
allArticleImages.forEach(img => {
  const st = fs.statSync(img);
  if (brainMap[st.size]) {
    console.log(`${img} (${st.size} bytes) -> brain artifact: ${brainMap[st.size]}`);
  }
});
