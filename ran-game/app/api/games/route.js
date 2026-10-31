export async function GET(request) {
  const { STEAM_API_KEY } = process.env;
  const { searchParams } = new URL(request.url);
  const steamid = searchParams.get('steamid');

  if (!steamid || !/^\d{17}$/.test(steamid)) {
    return Response.json({ error: 'SteamID inválido.' }, { status: 400 });
  }
  if (!STEAM_API_KEY) {
    console.error('STEAM_API_KEY is not configured.');
    return Response.json({ error: 'La API de Steam no está configurada.' }, { status: 500 });
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${encodeURIComponent(STEAM_API_KEY)}&steamid=${steamid}&include_appinfo=true&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Steam API returned HTTP ${response.status}.`);
      return Response.json({ error: 'No se pudo consultar Steam.' }, { status: 502 });
    }
    const data = await response.json();
    return Response.json(data.response);
  } catch {
    console.error('Steam API request failed or returned invalid JSON.');
    return Response.json({ error: 'No se pudo consultar Steam.' }, { status: 502 });
  }
}
