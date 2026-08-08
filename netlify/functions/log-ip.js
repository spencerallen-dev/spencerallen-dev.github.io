export async function handler(event, context) {
  const webhookUrl = process.env.WEBHOOK_URL;

  // Validate environment variable
  if (!webhookUrl) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server configuration error: WEBHOOK_URL environment variable is missing.' }),
    };
  }

  // Extract IP address from Netlify proxy headers
  const ip = event.headers['x-nf-client-connection-ip'] ||
             event.headers['client-ip'] ||
             (event.headers['x-forwarded-for'] ? event.headers['x-forwarded-for'].split(',')[0].trim() : 'Unknown');

  // Extract visitor User-Agent and generate ISO timestamp
  const userAgent = event.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toISOString();

  // Construct structured Discord webhook embed payload
  const payload = {
    username: 'Visitor Logger',
    embeds: [
      {
        title: '🌐 New Site Visitor',
        color: 3447003, // Hex #3498DB (Blue)
        fields: [
          { name: 'IP Address', value: `\`${ip}\``, inline: true },
          { name: 'Timestamp (UTC)', value: timestamp, inline: true },
          { name: 'User-Agent', value: userAgent }
        ],
        timestamp: timestamp
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with HTTP status ${response.status}`);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'success', message: 'Visitor logged successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to deliver webhook payload', details: error.message })
    };
  }
}
