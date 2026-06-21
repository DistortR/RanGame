'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MI_STEAM_ID = '76561198864909292';

export default function Home() {
  const [steamid, setSteamid] = useState('');
  const router = useRouter();

  function buscar(idAUsar) {
    router.push(`/random?steamid=${idAUsar}`);
  }

  return (
    <main>
      <h1>Steam Roulette</h1>

      <input
        type="text"
        placeholder="Ingresa un SteamID"
        value={steamid}
        onChange={(e) => setSteamid(e.target.value)}
      />
      <button onClick={() => buscar(steamid)}>Buscar</button>

      <hr />

      <button onClick={() => buscar(MI_STEAM_ID)}>
        Usar mi biblioteca
      </button>
    </main>
  );
}