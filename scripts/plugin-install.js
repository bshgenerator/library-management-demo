import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BshEngine } from '@bshsolutions/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLUGIN_DIR = path.join(__dirname, '../bshplugin');
const ENGINE_URL = process.env.APP_BSH_ENGINE_URL;
const API_KEY = process.env.APP_BSH_ENTITIES_APIKEY;

if (!ENGINE_URL || !API_KEY) {
  console.error('Error: APP_BSH_ENGINE_URL or APP_BSH_ENTITIES_APIKEY environment variable is not set');
  console.error('Please set:');
  if (!ENGINE_URL) console.error('  - APP_BSH_ENGINE_URL (e.g., http://localhost:2021)');
  if (!API_KEY) console.error('  - APP_BSH_ENTITIES_APIKEY');
  process.exit(1);
}

const bshengine = new BshEngine({
  host: ENGINE_URL,
  apiKey: API_KEY
});

async function pluginWalk(dir = PLUGIN_DIR, manifest = null, result = null) {
  if (result === null) result = [];

  const files = fs.readdirSync(dir);

  // order by name + files first
  files.sort((a, b) => a.localeCompare(b));
  files.sort((a) => fs.statSync(path.join(dir, a)).isDirectory() ? 1 : -1);

  if (manifest === null && files.includes('__manifest__.json')) {
    manifest = JSON.parse(fs.readFileSync(path.join(dir, '__manifest__.json'), 'utf-8'));
    files.splice(files.indexOf('__manifest__.json'), 1);
  }

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      pluginWalk(filePath, manifest, result);
    } else {
      if (manifest !== null) {
        const target = manifest.target;

        const pluginItem = result.find(p => p.target === target);
        if (pluginItem) {
          pluginItem.files.push({
            path: filePath,
            manifest: manifest
          });
        } else {
          result.push({
            target: target,
            files: [
              {
                path: filePath,
                manifest: manifest
              }
            ]
          });
        }
      }
    }
  }

  return result;
}

async function installPlugin(plugin = []) {
  console.log(`========================================`);
  console.log(`Installing plugins...`);
  for (const pluginItem of plugin) {
    console.log(`  - ${pluginItem.target}`);
    for (const file of pluginItem.files) {
      const content = fs.readFileSync(file.path, 'utf-8');
      const entity = JSON.parse(content);
      
      const items = Array.isArray(entity) ? entity : [entity];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await bshengine.entity(pluginItem.target).create({
          payload: item,
          onSuccess: (response) => {
            console.log(`    - [${i + 1}] ${file.path}`);
          },
          onError: (error) => {
            console.error(`    - [${i + 1}] Error: ${JSON.stringify(error.response, null, 2)}`);
          }
        });
      }
    }
  }
}

const plugin = await pluginWalk();
installPlugin(plugin);
