import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Deleting old reports...");
  const { error } = await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) { console.error(error); return; }
  console.log("Deleted old reports.");
}
run();
