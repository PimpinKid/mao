const http = require('http');

const postData = JSON.stringify({ password: 'admin123' });

const options = {
  hostname: 'localhost',
  port: 5050,
  path: '/api/admin/auth',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  const cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : '';
  
  const getOpts = {
    hostname: 'localhost',
    port: 5050,
    path: '/api/admin/users',
    method: 'GET',
    headers: { 'Cookie': cookie }
  };
  
  const req2 = http.request(getOpts, (res2) => {
      let data = '';
      res2.on('data', chunk => data += chunk);
      res2.on('end', () => console.log(res2.statusCode, data.substring(0, 500)));
  });
  req2.end();
});

req.write(postData);
req.end();
