import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const items = [
  { file: 'black-backpack.png', title: 'Black Backpack with Blue Zippers', category: 'Bags', location: 'Library, 2nd Floor', description: 'Black backpack, has a large S logo and blue zippers. Contains some notebooks.', type: 'found', contentType: 'image/png' },
  { file: 'cat-keychain.jpg', title: 'Cute Cat Keychain', category: 'Keys', location: 'Cafe Entrance', description: 'Small fluffy cat keychain with silver keys attached.', type: 'lost', contentType: 'image/jpeg' },
  { file: 'wallet.png', title: 'Leather Bifold Wallet', category: 'Wallets', location: 'Sports Complex', description: 'Brown leather wallet. Contains some cash and a student ID.', type: 'found', contentType: 'image/png' }
];

async function seed() {
  console.log("Starting DB seeding for missed/new items...");
  for (const item of items) {
    console.log(`Processing ${item.title}...`);
    const filePath = path.join('src/assets', item.file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `seed_${Date.now()}_${item.file}`;
    
    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(fileName, fileBuffer, {
        contentType: item.contentType
      });
      
    if (uploadError) {
      console.error('Error uploading image for', item.title, uploadError);
      continue;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);
      
    const { error: insertError } = await supabase
      .from('reports')
      .insert([{
        type: item.type,
        title: item.title,
        category: item.category,
        location: item.location,
        description: item.description,
        photo_url: publicUrlData.publicUrl
      }]);
      
    if (insertError) {
      console.error('Error inserting row for', item.title, insertError);
    } else {
      console.log(`Successfully seeded: ${item.title}`);
    }
  }
  console.log("Finished seeding missed/new items!");
}
seed();
