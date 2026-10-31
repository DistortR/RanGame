import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/games/route.js';

const originalFetch = globalThis.fetch;
const originalKey = process.env.STEAM_API_KEY;
after(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.STEAM_API_KEY;
  else process.env.STEAM_API_KEY = originalKey;
});

const request = () => new Request('http://localhost/api/games?steamid=76561198864909292');

test('reports missing configuration without contacting Steam', async () => {
  delete process.env.STEAM_API_KEY;
  globalThis.fetch = () => { throw new Error('should not fetch'); };
  const response = await GET(request());
  assert.equal(response.status, 500);
  assert.ok((await response.json()).error);
});

test('handles an HTML Steam error and returns successful libraries', async () => {
  process.env.STEAM_API_KEY = 'test-key';
  globalThis.fetch = async () => new Response('<html>Unauthorized</html>', { status: 401 });
  const failure = await GET(request());
  assert.equal(failure.status, 502);
  assert.ok((await failure.json()).error);

  globalThis.fetch = async () => Response.json({ response: { games: [{ appid: 1 }] } });
  const success = await GET(request());
  assert.deepEqual(await success.json(), { games: [{ appid: 1 }] });
});
