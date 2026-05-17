#!/usr/bin/env node
/*
  testLogin.js
  Usage: set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_TEST_EMAIL, SUPABASE_TEST_PASSWORD
    node scripts/testLogin.js
*/
import fs from 'fs';

function loadEnv() {
  const envPath = './.env.local';
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+)=([\s\S]*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if ((val.startsWith("\'") && val.endsWith("\'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnv();
console.log('testLogin.js starting');
console.log('SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
console.log('PUB_KEY', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'SET' : 'MISSING');
console.log('TEST_EMAIL', process.env.SUPABASE_TEST_EMAIL ? 'SET' : 'MISSING');
console.log('TEST_PASSWORD', process.env.SUPABASE_TEST_PASSWORD ? 'SET' : 'MISSING');

(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const PUB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !PUB_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, PUB_KEY);

  const email = process.env.SUPABASE_TEST_EMAIL;
  const password = process.env.SUPABASE_TEST_PASSWORD;

  if (!email || !password) {
    console.error('Please set SUPABASE_TEST_EMAIL and SUPABASE_TEST_PASSWORD in env to run this test.');
    process.exit(1);
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('Login successful. Session data:', data.session ? 'session present' : data);
  } catch (err) {
    console.error('Login failed:', err.message || err);
    process.exit(1);
  }
})();
