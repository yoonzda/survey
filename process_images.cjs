const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\누리아이 개발팀\\.gemini\\antigravity\\brain\\d313151e-fdb7-41b5-8af4-35c1c8c04685";
const dest = "c:\\0_z\\survey\\public\\images";

async function processImages() {
  const files = fs.readdirSync(src).filter(f => f.match(/^q2_b_matched_/));
  
  for (const f of files) {
    const parts = f.split('_');
    const outName = parts[0] + '_' + parts[1] + '.png';
    const inPath = path.join(src, f);
    const outPath = path.join(dest, outName);
    
    console.log(`Processing ${f}...`);
    try {
      const image = await Jimp.read(inPath);
      
      // Make white pixels transparent
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // If pixel is white or very close to white
        if (r > 240 && g > 240 && b > 240) {
          this.bitmap.data[idx + 3] = 0; // Alpha = 0 (transparent)
        }
      });
      
      await image.write(outPath);
      console.log(`Saved to ${outPath}`);
    } catch(err) {
      console.error('Error processing ' + f, err);
    }
  }
}

processImages();
