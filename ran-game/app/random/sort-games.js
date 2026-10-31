export function sortGames(games, order, direction = 'asc') {
  return [...games].sort((a, b) => {
    const byName = () => (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' });
    const comparison = order === 'hours'
      ? (a.playtime_forever || 0) - (b.playtime_forever || 0)
      : byName();
    return (direction === 'desc' ? -comparison : comparison) || byName();
  });
}
