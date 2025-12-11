import 'dotenv/config';
import { BshEngine } from '@bshsolutions/sdk';

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

bshengine.entity('Books').delete({payload: {entity: 'Books'}});
bshengine.entity('Transactions').delete({payload: {entity: 'Transactions'}});
bshengine.entity('Fines').delete({payload: {entity: 'Fines'}});
bshengine.entity('Reservations').delete({payload: {entity: 'Reservations'}});

bshengine.core.BshUsers.delete({payload: {
  filters: [
    {field: 'roles', operator: 'ilike', value: 'member'}
  ]
}});

