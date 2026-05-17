#!/usr/bin/env node
/*
  createPasswordUser.js
  Usage: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE.
    Set NEW_USER_EMAIL and NEW_USER_PASSWORD, then run:
      node scripts/createPasswordUser.js
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
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnv();

(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY in environment.');
    process.exit(1);
  }

  const email = process.env.NEW_USER_EMAIL;
  const password = process.env.NEW_USER_PASSWORD;
  const name = process.env.NEW_USER_NAME;
  const role = process.env.NEW_USER_ROLE;

  if (!email || !password) {
    console.error('Please set NEW_USER_EMAIL and NEW_USER_PASSWORD in env to create a new user.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const payload = {
      email,
      password,
      email_confirm: true,
      user_metadata: {},
    };

    if (name) payload.user_metadata.full_name = name;
    if (role) payload.user_metadata.role = role;

    const { data, error } = await supabase.auth.admin.createUser(payload);
    if (error) {
      throw error;
    }

    console.log('Created login/password user successfully:');
    console.log({ id: data.user?.id, email: data.user?.email, status: data.user?.email_confirmed ? 'confirmed' : 'unconfirmed' });
    if (name) console.log('name:', name);
    if (role) console.log('role:', role);
  } catch (err) {
    console.error('Failed to create user:', err.message || err);
    process.exit(1);
  }
})();
