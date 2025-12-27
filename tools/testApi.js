/*
Simple Node script to test API endpoints.
Usage:
  node tools/testApi.js [BASE_URL] [--post]
Or with env vars:
  BASE_URL=https://your-api.com ALLOW_POST=true node tools/testApi.js

By default the script will perform:
  GET {BASE_URL}/admin/users?type=agency
If `--post` or `ALLOW_POST=true` is provided it will also POST to
  POST {BASE_URL}/admin/staff
with a sample payload. Use with caution (may create real data).
*/

const axios = require('axios');

const arg = process.argv[2];
const flags = process.argv.slice(2);
const BASE = (process.env.BASE_URL || arg || 'https://friends-circle.vercel.app').replace(/\/+$/, '');
const allowPost = process.env.ALLOW_POST === 'true' || flags.includes('--post') || flags.includes('-p');

async function run() {
  console.log('Using BASE URL:', BASE);
  console.log('ALLOW_POST:', allowPost);

  // GET agencies
  try {
    const res = await axios.get(`${BASE}/admin/users?type=agency`, { timeout: 20000 });
    console.log('\nGET /admin/users?type=agency ->', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('\nGET /admin/users?type=agency ERROR:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }

  if (!allowPost) {
    console.log('\nSkipping POST /admin/staff (allowPost is false). To enable: set ALLOW_POST=true or pass --post');
    return;
  }

  // POST create staff
  const payload = {
    email: 'staff1@example.com',
    password: 'Staff@123',
    status: 'publish',
    permissions: {
      interest: { read: true, write: false, update: true },
      language: { read: true },
      religion: { read: true, write: true, update: true },
      relationGoals: { write: true },
      plan: { read: false, write: true },
      package: { read: true },
      page: { read: true },
      faq: { read: true, write: true },
      gift: { read: true },
    },
  };

  try {
    const r = await axios.post(`${BASE}/admin/staff`, payload, { timeout: 20000 });
    console.log('\nPOST /admin/staff ->', r.status);
    console.log(JSON.stringify(r.data, null, 2));
  } catch (err) {
    console.error('\nPOST /admin/staff ERROR:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

run();
