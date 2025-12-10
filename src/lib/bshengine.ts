import { BshEngine } from "@bshsolutions/sdk";

export const bshengine = new BshEngine({
  host: import.meta.env.VITE_APP_BSH_ENGINE_URL || 'http://localhost:7071',
  authFn: async () => {
    return {
      token: localStorage.getItem('access_token') || '',
      type: 'JWT'
    };
  },
  refreshTokenFn: async () => {
    return localStorage.getItem('refresh_token') || '';
  }
});
