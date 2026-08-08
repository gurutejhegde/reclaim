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
  { file: 'airpods.png', title: 'Airpods Pro', category: 'Electronics', location: 'Cafeteria', description: 'White airpods pro in a standard case.', type: 'lost', contentType: 'image/png', reported_by: 'gurutej' },
  { file: 'black-backpack.png', title: 'Black Nike Backpack', category: 'Bags', location: 'Library, 2nd Floor', description: 'Has my textbooks inside.', type: 'lost', contentType: 'image/png', reported_by: 'gurutej' },
  { file: 'cat-keychain.png', title: 'Cat Keychain', category: 'Keys', location: 'Engineering Block', description: 'Cute cat keychain attached to house keys.', type: 'found', contentType: 'image/png', reported_by: 'sarah' },
  { file: 'charger.png', title: 'MacBook Charger', category: 'Electronics', location: 'Library, 1st Floor', description: 'White apple charger.', type: 'found', contentType: 'image/png', reported_by: 'alex' },
  { file: 'headphones.png', title: 'Sony Headphones', category: 'Electronics', location: 'Student Center', description: 'Black Sony WH-1000XM4 headphones.', type: 'lost', contentType: 'image/png', reported_by: 'gurutej' },
  { file: 'pen.jpg', title: 'Expensive Fountain Pen', category: 'Other', location: 'Lecture Hall 3', description: 'Gold accented fountain pen.', type: 'found', contentType: 'image/jpeg', reported_by: 'alex' },
  { file: 'red-notebook.png', title: 'Red Notebook', category: 'Other', location: 'Cafe', description: 'Red moleskine notebook with lecture notes.', type: 'lost', contentType: 'image/png', reported_by: 'gurutej' },
  { file: 'samsung-phone.png', title: 'Samsung Galaxy Phone', category: 'Electronics', location: 'Sports Ground', description: 'Black phone with a clear case.', type: 'found', contentType: 'image/png', reported_by: 'sarah' },
  { file: 'wallet.png', title: 'Brown Leather Wallet', category: 'Wallets', location: 'Hostel A', description: 'Brown leather wallet with some cash and ID.', type: 'lost', contentType: 'image/png', reported_by: 'gurutej' },
  { file: 'water-bottle.png', title: 'Blue Hydroflask', category: 'Other', location: 'Gym', description: 'Blue water bottle with some stickers.', type: 'lost', contentType: 'image/png', reported_by: 'gurutej' }
];

async function seed() {
  console.log("Starting DB seeding for 4 users...");
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
        photo_url: publicUrlData.publicUrl,
        reported_by: item.reported_by,
        status: 'open'
      }]);
      
    if (insertError) {
      console.error('Error inserting row for', item.title, insertError);
    } else {
      console.log(`Successfully seeded: ${item.title} (by ${item.reported_by})`);
    }
  }
  console.log("Finished seeding multi-user items!");
}
seed();
