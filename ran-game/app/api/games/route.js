// src/app/api/games/route.js
export async function GET(request) {
  const { STEAM_API_KEY } = process.env;
  const { searchParams } = new URL(request.url);
  const steamid = searchParams.get('steamid');

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamid}&include_appinfo=true&format=json`;

  const response = await fetch(url);
  const data = await response.json();

  return Response.json(data.response);
}