'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Library() {
  const searchParams = useSearchParams();
  const steamid = searchParams.get('steamid');

  const [games, setGames] = useState([]);
  const [randomGame, setRandomGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games?steamid=${steamid}`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data.games);
        setLoading(false);
      });
  }, [steamid]);

  function elegirJuegoAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * games.length);
    setRandomGame(games[indiceAleatorio]);
  }

  if (loading) return <p>Cargando tu biblioteca...</p>;

  return (
    <main>
      <h1>Tienes {games.length} juegos</h1>
      <button onClick={elegirJuegoAleatorio}>Elegir juego al azar</button>

      {randomGame && (
        <div>
          <h2>{randomGame.name}</h2>
          <p>Tiempo jugado: {Math.round(randomGame.playtime_forever / 60)} horas</p>
        </div>
      )}
    </main>
  );
}