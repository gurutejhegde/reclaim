import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const items = [
  { file: 'water-bottle.png', title: 'Blue Water Bottle', category: 'Other', location: 'Main Cafeteria', description: 'Light blue water bottle with time markers.', type: 'lost' },
  { file: 'black-backpack.png', title: 'Black Backpack with Blue Zippers', category: 'Bags', location: 'Library, 2nd Floor', description: 'Black backpack, has a large S logo and blue zippers. Contains some notebooks.', type: 'found' },
  { file: 'airpods.png', title: 'AirPods Pro', category: 'Electronics', location: 'CS Block Lab 1', description: 'Found in the white case.', type: 'found' },
  { file: 'headphones.png', title: 'Over-ear Headphones', category: 'Electronics', location: 'Sports Ground', description: 'Gray/black headphones found on the grass near the bleachers.', type: 'found' },
  { file: 'samsung-phone.png', title: 'Samsung Galaxy Phone', category: 'Electronics', location: 'Auditorium', description: 'Black Samsung smartphone. Found on a wooden desk in the back row.', type: 'found' },
  { file: 'red-notebook.png', title: 'Vintage Red Notebook', category: 'Other', location: 'Library Cafe', description: 'Red journal/notebook with intricate cover designs.', type: 'lost' },
  { file: 'charger.png', title: 'Black Power Adapter', category: 'Electronics', location: 'Hostel A Lobby', description: 'Standard black charger block with attached cable.', type: 'found' }
];

async function seed() {
  console.log("Starting DB seeding...");
  for (const item of items) {
    console.log(`Processing ${item.title}...`);
    const filePath = path.join('src/assets', item.file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `seed_${Date.now()}_${item.file}`;
    
    // Upload image
    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png'
      });
      
    if (uploadError) {
      console.error('Error uploading image for', item.title, uploadError);
      continue;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);
      
    // Insert row
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
  console.log('Done seeding!');
}

seed();
