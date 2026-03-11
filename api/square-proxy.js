export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, locationId, cursor } = req.body;

    if (!accessToken || !locationId) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const body = { enabled_location_ids: [locationId] };
    if (cursor) body.cursor = cursor;

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
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

4. Click **"Commit changes"**

### **Step 3: Wait for Vercel to Redeploy**

1. Vercel automatically detects GitHub changes
2. Wait 30-60 seconds
3. Check your Vercel dashboard - should show "Building"

### **Step 4: Test**

Visit: `https://your-app.vercel.app/api/square-proxy`

Should see: `{"error":"Method not allowed"}` ✅ (This means it's working!)

If still 404, the deployment didn't work.

---

## 🔍 Verify Your GitHub Repo Structure:

After adding the file, your repo should look like:
```
bookstore/
├── index.html
└── api/
    └── square-proxy.js
