import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGIN_DIR = path.join(__dirname, '../bshplugin');
const ENTITIES_DIR = path.join(PLUGIN_DIR, '1.Entities');
const ENGINE_URL = process.env.APP_BSH_ENGINE_URL;
const API_KEY = process.env.APP_BSH_ENTITIES_APIKEY;

if (!ENGINE_URL || !API_KEY) {
  console.error('Error: APP_BSH_ENGINE_URL or APP_BSH_ENTITIES_APIKEY environment variable is not set');
  console.error('Please set:');
  if (!ENGINE_URL) console.error('  - APP_BSH_ENGINE_URL (e.g., http://localhost:2021)');
  if (!API_KEY) console.error('  - APP_BSH_ENTITIES_APIKEY');
  process.exit(1);
}

const API_URL = `${ENGINE_URL}/api/entities/BshEntities`;

async function createEntities() {
  try {
    // Read all JSON files from the entities directory
    const files = fs.readdirSync(ENTITIES_DIR);
    const entityFiles = files.filter(file => 
      file.endsWith('.json') && file !== '__manifest__.json'
    );

    if (entityFiles.length === 0) {
      console.log('No entity files found');
      return;
    }

    console.log(`Found ${entityFiles.length} entity file(s):`);
    
    // Read and parse all entity files
    const entities = [];
    for (const file of entityFiles) {
      const filePath = path.join(ENTITIES_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const entity = JSON.parse(content);
      entities.push({ file, entity });
      console.log(`  - ${file} (${entity.name})`);
    }

    // Send entities one by one
    console.log(`\nCreating entities in ${API_URL}...\n`);
    
    let successCount = 0;
    let failCount = 0;

    for (const { file, entity } of entities) {
      try {
        console.log(`Creating ${entity.name}...`);
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-BSH-APIKEY': API_KEY
          },
          body: JSON.stringify(entity)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`  ❌ Failed: ${entity.name}`);
          console.error(`     Status: ${response.status}`);
          console.error(`     Response: ${errorText}`);
          failCount++;
        } else {
          const result = await response.json();
          console.log(`  ✅ Success: ${entity.name}`);
          successCount++;
        }
      } catch (error) {
        console.error(`  ❌ Error creating ${entity.name}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${entities.length}`);

    if (failCount > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Error creating entities:', error.message);
    process.exit(1);
  }
}

createEntities();
