'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MI_STEAM_ID = '76561198864909292';

export default function Home() {
  const [steamid, setSteamid] = useState('');
  const router = useRouter();

  function buscar(idAUsar) {
    const id = idAUsar.trim();
    if (!id) return;
    router.push('/random?steamid=' + encodeURIComponent(id));
  }

  function handleSubmit(event) {
    event.preventDefault();
    buscar(steamid);
  }

  return (
    <main className="app-shell home-shell">
      <header className="site-header">
        <Link className="brand-lockup" href="/" aria-label="RanGame, inicio">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-wordmark">RAN<span>/</span>GAME</span>
        </Link>
        <div className="header-badge"><span className="status-dot" /> STEAM ROULETTE</div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark">01</span> TU BIBLIOTECA, NUEVA PARTIDA</p>
          <h1 className="hero-title">¿Qué toca <span>jugar hoy?</span></h1>
          <p className="hero-description">
            Deja que el azar elija tu próxima partida de Steam.
          </p>

          <div className="hero-primary">
            <button className="button button-primary" onClick={() => buscar(MI_STEAM_ID)}>
              Usar mi biblioteca <span aria-hidden="true">↗</span>
            </button>
            <p className="hero-helper">Un giro y ya estás jugando.</p>
          </div>

          <form className="steam-form" onSubmit={handleSubmit}>
            <label htmlFor="steamid">¿Quieres usar otro perfil?</label>
            <div className="input-row">
              <input
                id="steamid"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Pega aquí tu SteamID"
                value={steamid}
                onChange={(event) => setSteamid(event.target.value)}
                required
              />
              <button className="button button-quiet" type="submit">
                Buscar <span aria-hidden="true">↗</span>
              </button>
            </div>
            <p className="form-hint">El perfil debe tener visibles los detalles de sus juegos.</p>
          </form>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-outer" />
          <div className="orbit orbit-inner" />
          <div className="orbit orbit-dashed" />
          <div className="orbit-core">
            <span className="orbit-kicker">RAN / GAME</span>
            <span className="orbit-question">?</span>
            <span className="orbit-caption">PICK YOUR NEXT</span>
          </div>
          <span className="orbit-label orbit-label-top">PICK / PLAY / REPEAT</span>
          <span className="orbit-label orbit-label-side">RANDOM MODE <b>01</b></span>
          <span className="orbit-spark orbit-spark-one">✳</span>
          <span className="orbit-spark orbit-spark-two">✳</span>
          <span className="orbit-sticker">NO MÁS<br />SCROLL<br />ETERNO</span>
        </div>
      </section>

      <footer className="home-footer">
        <span>HECHO PARA ENCONTRAR TU PRÓXIMA PARTIDA</span>
        <span className="footer-index">RNG <b>—</b> 001</span>
      </footer>
    </main>
  );
}
