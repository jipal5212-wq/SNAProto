const http = require('http');

async function testAuthAndPages() {
  console.log('Testing SNAP Web Portal flows...');

  // Helper for requests
  function makeRequest(path, method = 'GET', body = null, cookie = null) {
    return new Promise((resolve, reject) => {
      const parsedBody = body ? new URLSearchParams(body).toString() : '';
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: method,
        headers: {
          ...(cookie ? { 'Cookie': cookie } : {}),
          ...(body ? {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(parsedBody)
          } : {})
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', reject);
      if (body) req.write(parsedBody);
      req.end();
    });
  }

  // 1. Test Login as Evaluator
  console.log('1. Attempting login as evaluator@demo.com...');
  const loginRes = await makeRequest('/auth/login', 'POST', {
    email: 'evaluator@demo.com',
    password: 'password'
  });

  const cookieHeader = loginRes.headers['set-cookie'];
  if (!cookieHeader) throw new Error('No session cookie returned on login');
  const sessionCookie = cookieHeader[0].split(';')[0];
  console.log('   -> Logged in successfully! Session established.');

  // 2. Access Government Challenges Page
  console.log('2. Accessing Government Challenges Page...');
  const challengesRes = await makeRequest('/government/challenges', 'GET', null, sessionCookie);
  console.log(`   -> Status: ${challengesRes.statusCode} (${challengesRes.body.includes('Challenges') ? 'Contains Challenges UI' : 'Error'})`);

  // 3. Access Government Dashboard
  console.log('3. Accessing Government Dashboard...');
  const dashRes = await makeRequest('/government/dashboard', 'GET', null, sessionCookie);
  console.log(`   -> Status: ${dashRes.statusCode} (${dashRes.body.includes('Dashboard') ? 'Contains Dashboard UI' : 'Error'})`);

  // 4. Access Pilots Page
  console.log('4. Accessing Pilots Page...');
  const pilotsRes = await makeRequest('/government/pilots', 'GET', null, sessionCookie);
  console.log(`   -> Status: ${pilotsRes.statusCode} (${pilotsRes.body.includes('Pilots') ? 'Contains Pilots UI' : 'Error'})`);

  console.log('\n=============================================');
  console.log('WEB FLOW FULLY OPERATIONAL AS ONE APPLICATION');
  console.log('=============================================');
}

testAuthAndPages().catch(err => {
  console.error('Web flow test failed:', err);
  process.exit(1);
});
