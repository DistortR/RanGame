'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sortGames } from './sort-games';

export default function Page() {
  return <Suspense fallback={<main className="app-shell">Cargando biblioteca…</main>}><Library /></Suspense>;
}

function Library() {
  const searchParams = useSearchParams();
  const steamid = searchParams.get('steamid');

  const [library, setLibrary] = useState(null);
  const [selection, setSelection] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [sortOrder, setSortOrder] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const currentLibrary = library?.steamid === steamid;
  const games = currentLibrary && !library.error ? library.games : [];
  const loading = Boolean(steamid) && !currentLibrary;
  const error = !steamid || (currentLibrary && library.error);
  const randomGame = selection?.steamid === steamid ? selection.game : null;

  useEffect(() => {
    if (!steamid) return;

    const controller = new AbortController();
    fetch('/api/games?steamid=' + encodeURIComponent(steamid), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la biblioteca.');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.games)) throw new Error('La respuesta no contiene juegos.');
        if (!controller.signal.aborted) {
          setLibrary({ steamid, games: data.games, error: false });
        }
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError' && !controller.signal.aborted) {
          setLibrary({ steamid, games: [], error: true });
        }
      });

    return () => controller.abort();
  }, [steamid]);

  function elegirJuegoAleatorio() {
    if (!games.length) return;
    setImageError(false);
    setSelection({ steamid, game: games[Math.floor(Math.random() * games.length)] });
  }

  const totalHours = Math.round(
    games.reduce((total, game) => total + (game.playtime_forever || 0), 0) / 60,
  );
  const imageSrc = randomGame?.appid
    ? 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/' + randomGame.appid + '/header.jpg'
    : null;

  let gameTitle = 'Dale una oportunidad al azar.';
  let gameDescription = 'Pulsa el botón y deja que tu biblioteca decida.';
  if (loading) {
    gameTitle = 'Leyendo tu biblioteca…';
    gameDescription = 'Un momento, estamos buscando tus juegos de Steam.';
  } else if (error) {
    gameTitle = 'No pudimos cargar tus juegos.';
    gameDescription = 'Revisa el SteamID y confirma que los detalles de tus juegos sean públicos.';
  } else if (!games.length) {
    gameTitle = 'Aquí no hay juegos que elegir.';
    gameDescription = 'No encontramos juegos en este perfil de Steam.';
  } else if (randomGame) {
    gameTitle = randomGame.name;
    gameDescription = 'La elección está hecha. Hora de jugar.';
  }

  return (
    <main className="app-shell library-shell">
      <header className="site-header">
        <Link className="brand-lockup" href="/" aria-label="RanGame, inicio">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-wordmark">RAN<span>/</span>GAME</span>
        </Link>
        <Link className="back-link" href="/"><span aria-hidden="true">←</span> Cambiar biblioteca</Link>
      </header>

      <section className="library-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-mark">02</span> TU COLECCIÓN STEAM</p>
          <h1>La siguiente <span>partida.</span></h1>
          <p className="library-description">Menos buscar. Más jugar.</p>
        </div>
        <div className="library-stats" aria-label="Resumen de biblioteca">
          <div className="stat-block">
            <span className="stat-label">JUEGOS</span>
            <strong>{loading || error ? '—' : games.length.toLocaleString('es-MX')}</strong>
          </div>
          <div className="stat-block">
            <span className="stat-label">HORAS JUGADAS</span>
            <strong>{loading || error ? '—' : totalHours.toLocaleString('es-MX')}</strong>
          </div>
        </div>
      </section>

      <section className="game-stage" aria-busy={loading}>
        <div className="game-art-frame">
          {imageSrc && !imageError ? (
            <Image
              className="game-cover"
              src={imageSrc}
              alt={'Portada de ' + randomGame.name}
              fill
              sizes="(max-width: 760px) 100vw, 55vw"
              onError={() => setImageError(true)}
            />
          ) : randomGame ? (
            <div className="art-unavailable"><span>PORTADA NO DISPONIBLE</span></div>
          ) : (
            <div className={'art-placeholder' + (loading ? ' art-loading' : '')}>
              <div className="placeholder-orbit"><span>{loading ? '…' : '?'}</span></div>
              <span className="placeholder-caption">{loading ? 'CARGANDO TU BIBLIOTECA' : 'LISTO CUANDO TÚ LO ESTÉS'}</span>
            </div>
          )}
          <div className="art-shade" />
          <span className="art-label">
            {randomGame ? 'STEAM / ' + randomGame.appid : 'RAN / GAME · RANDOM PICK'}
          </span>
        </div>

        <div className="game-info" aria-live="polite">
          <p className="eyebrow"><span className="eyebrow-mark">↳</span> TU PRÓXIMO JUEGO</p>
          <h2>{randomGame && !loading && !error ? <span className="game-list-name"><a className="game-title-link" style={{ fontSize: 'inherit', fontFamily: 'inherit' }} href={'https://store.steampowered.com/app/' + randomGame.appid + '/'} target="_blank" rel="noopener noreferrer">{gameTitle}</a></span> : gameTitle}</h2>
          <p className="game-description" role={loading ? 'status' : undefined}>{gameDescription}</p>

          {randomGame && !loading && !error && (
            <div className="playtime-panel">
              <span className="playtime-icon" aria-hidden="true">◷</span>
              <span className="playtime-copy">
                <span className="stat-label">TIEMPO JUGADO</span>
                <strong>{Math.round((randomGame.playtime_forever || 0) / 60).toLocaleString('es-MX')} <small>h</small></strong>
              </span>
              <span className="playtime-note">EN TOTAL</span>
            </div>
          )}

          <button
            className="button button-primary pick-button"
            onClick={elegirJuegoAleatorio}
            disabled={loading || error || !games.length}
          >
            {randomGame ? 'Elegir otro juego' : 'Elegir juego al azar'}
            <span aria-hidden="true">↗</span>
          </button>
          <p className="pick-hint">Selección aleatoria entre tus juegos de Steam.</p>
        </div>
      </section>

      {!loading && !error && games.length > 0 && (
        <section className="game-library" aria-labelledby="game-library-title">
          <div className="game-library-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-mark">03</span> TU COLECCIÓN</p>
              <h2 id="game-library-title">Todos tus juegos<span>.</span></h2>
            </div>
            <span className="stat-label">{games.length.toLocaleString('es-MX')} JUEGOS</span>
          </div>
          <div className="game-sort" role="group" aria-label="Ordenar juegos">
            <span className="stat-label">ORDENAR POR</span>
            <button className={'button ' + (sortOrder === 'name' ? 'button-primary' : 'button-quiet')} type="button" aria-pressed={sortOrder === 'name'} onClick={() => setSortOrder('name')}>Nombre</button>
            <button className={'button ' + (sortOrder === 'hours' ? 'button-primary' : 'button-quiet')} type="button" aria-pressed={sortOrder === 'hours'} onClick={() => setSortOrder('hours')}>Horas jugadas</button>
            <div className="game-sort-direction" role="group" aria-label="Dirección del orden">
              <button className={'button ' + (sortDirection === 'asc' ? 'button-primary' : 'button-quiet')} type="button" aria-label="Ascendente" aria-pressed={sortDirection === 'asc'} onClick={() => setSortDirection('asc')}>↑</button>
              <button className={'button ' + (sortDirection === 'desc' ? 'button-primary' : 'button-quiet')} type="button" aria-label="Descendente" aria-pressed={sortDirection === 'desc'} onClick={() => setSortDirection('desc')}>↓</button>
            </div>
          </div>
          <ul className="game-list">
            {sortGames(games, sortOrder, sortDirection).map((game) => (
              <li className="game-list-item" key={game.appid}>
                <div className="game-list-name">
                  <span className="game-list-icon" aria-hidden="true">↗</span>
                  <div>
                    <a href={'https://store.steampowered.com/app/' + game.appid + '/'} target="_blank" rel="noopener noreferrer">{game.name}</a>
                    <span className="game-list-id">STEAM / {game.appid}</span>
                  </div>
                </div>
                <div className="game-list-time">
                  <span className="stat-label">TIEMPO JUGADO</span>
                  <strong>{((game.playtime_forever || 0) / 60).toLocaleString('es-MX', { maximumFractionDigits: 1 })} h</strong>
                  {game.playtime_2weeks > 0 && <span className="game-list-recent">{(game.playtime_2weeks / 60).toLocaleString('es-MX', { maximumFractionDigits: 1 })} h últimas 2 semanas</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="library-footer">
        <span>UNA BIBLIOTECA. INFINITAS POSIBILIDADES.</span>
        <span className="footer-index">RNG <b>—</b> 002</span>
      </footer>
    </main>
  );
}
