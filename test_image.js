const https = require('https');

https.get('https://loremflickr.com/800/800/jewelry,ring?lock=1', (res) => {
  console.log('loremflickr:', res.statusCode);
  if(res.statusCode === 302) {
      console.log('Location:', res.headers.location);
  }
});
