const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches';

module.exports = async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    const upstream = await fetch(API_URL, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    const body = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching matches' });
  }
};
