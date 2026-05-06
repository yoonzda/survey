const https = require('https');
https.get('https://yoonzda.github.io/survey/', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log(data));
});
