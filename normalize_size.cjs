const { Jimp } = require('jimp');
const fs = require('fs');

async function normalize() {
  const dir = 'c:\\0_z\\survey\\public\\images\\';
  const files = fs.readdirSync(dir).filter(f => f.match(/^q\d+_[ab]\.png$/));
  
  for (const f of files) {
    const path = dir + f;
    console.log(`Processing ${f}...`);
    try {
      const img = await Jimp.read(path);
      // Autocrop removes transparent borders
      img.autocrop();
      
      // Let's add a consistent 10% padding so they don't hit the absolute edges of the UI container
      const w = img.bitmap.width;
      const h = img.bitmap.height;
      const padding = Math.floor(Math.max(w, h) * 0.15);
      
      const newImg = new Jimp({ width: w + padding * 2, height: h + padding * 2, color: 0x00000000 });
      newImg.composite(img, padding, padding);
      
      await newImg.write(path);
      console.log(`Successfully normalized ${f}`);
    } catch (e) {
      console.error(`Failed to process ${f}`, e);
    }
  }
}

normalize();
