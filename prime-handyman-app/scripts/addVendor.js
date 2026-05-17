#!/usr/bin/env node
/*
  addVendor.js
  Usage: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env, then run:
    node scripts/addVendor.js
  Optionally set VENDOR_NAME, VENDOR_WEBSITE, VENDOR_CATEGORY
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

(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const vendor = {
    name: process.env.VENDOR_NAME || 'Test Vendor',
    website: process.env.VENDOR_WEBSITE || 'https://example.com',
    category: process.env.VENDOR_CATEGORY || 'General',
    contact_person: process.env.VENDOR_CONTACT || null,
    phone: process.env.VENDOR_PHONE || null,
    email: process.env.VENDOR_EMAIL || null,
  };

  try {
    const { data, error } = await supabase.from('vendors').insert([vendor]).select();
    if (error) throw error;
    console.log('Inserted vendor:', data);
  } catch (err) {
    console.error('Error inserting vendor:', err.message || err);
    process.exit(1);
  }
});
