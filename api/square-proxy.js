// Vercel Serverless Function: /api/square-proxy.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, locationId, cursor } = req.body;

    if (!accessToken || !locationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare request to Square API
    const body = {
      enabled_location_ids: [locationId]
    };

    if (cursor) {
      body.cursor = cursor;
    }

    // Call Square API from server-side
    const response = await fetch('https://connect.squareup.com/v2/catalog/search-catalog-items', {
      method: 'POST',
      headers: {
        'Square-Version': '2024-12-18',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Square API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
