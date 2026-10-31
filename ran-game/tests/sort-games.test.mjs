import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortGames } from '../app/random/sort-games.js';

test('sorts games by name or most hours without changing the library', () => {
  const games = [
    { name: 'Zelda', playtime_forever: 60 },
    { name: 'Árbol', playtime_forever: 120 },
    { name: 'Beta' },
    { name: 'Aventura', playtime_forever: 120 },
  ];
  assert.deepEqual(sortGames(games, 'name').map((game) => game.name), ['Árbol', 'Aventura', 'Beta', 'Zelda']);
  assert.deepEqual(sortGames(games, 'name', 'desc').map((game) => game.name), ['Zelda', 'Beta', 'Aventura', 'Árbol']);
  assert.deepEqual(sortGames(games, 'hours', 'asc').map((game) => game.name), ['Beta', 'Zelda', 'Árbol', 'Aventura']);
  assert.deepEqual(sortGames(games, 'hours', 'desc').map((game) => game.name), ['Árbol', 'Aventura', 'Zelda', 'Beta']);
  assert.equal(games[0].name, 'Zelda');
});
