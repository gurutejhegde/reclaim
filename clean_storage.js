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
  console.log("Fetching active reports...");
  const { data: reports, error: reportsErr } = await supabase.from('reports').select('photo_url');
  if (reportsErr) { console.error(reportsErr); return; }
  
  const activePhotos = new Set(
    reports.map(r => {
      if (!r.photo_url) return null;
      const parts = r.photo_url.split('/');
      return parts[parts.length - 1];
    }).filter(Boolean)
  );

  console.log(`Found ${activePhotos.size} active photos in database.`);
  console.log("Fetching files from storage...");
  
  const { data: files, error: filesErr } = await supabase.storage.from('item-images').list();
  if (filesErr) { console.error(filesErr); return; }
  
  const toDelete = files
    .filter(f => f.name !== '.emptyFolderPlaceholder' && !activePhotos.has(f.name))
    .map(f => f.name);
    
  if (toDelete.length === 0) {
    console.log("Storage is already clean. No orphaned files found.");
    return;
  }
  
  console.log(`Found ${toDelete.length} orphaned files. Deleting...`);
  const { error: deleteErr } = await supabase.storage.from('item-images').remove(toDelete);
  
  if (deleteErr) {
    console.error("Error deleting files:", deleteErr);
  } else {
    console.log(`Successfully deleted ${toDelete.length} orphaned files from Supabase!`);
  }
}
run();
