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

  // Parse client body if present
  let clientData = {};
  if (event.body) {
    try {
      clientData = JSON.parse(event.body);
    } catch (e) {
      // Fallback if body parsing fails
    }
  }

  // Extract server-side Netlify proxy headers
  const headers = event.headers || {};
  const ip = headers['x-nf-client-connection-ip'] ||
             headers['client-ip'] ||
             (headers['x-forwarded-for'] ? headers['x-forwarded-for'].split(',')[0].trim() : 'Unknown');

  const country = headers['x-country'] || headers['x-nf-country'] || headers['cf-ipcountry'] || 'N/A';
  const city = headers['x-city'] || headers['x-nf-city'] || 'N/A';
  const region = headers['x-region'] || headers['x-nf-subdivision'] || 'N/A';
  const userAgent = headers['user-agent'] || 'Unknown';
  const acceptLanguage = headers['accept-language'] || 'N/A';
  const timestamp = new Date().toISOString();

  // Location string construction
  const locationParts = [city, region, country].filter(p => p && p !== 'N/A');
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'N/A';

  // Construct detailed Discord embed payload
  const fields = [
    { name: '🌐 IP Address', value: `\`${ip}\``, inline: true },
    { name: '📍 Location (GeoIP)', value: locationStr, inline: true },
    { name: '📄 Page URL', value: clientData.url ? `[${clientData.path || 'Link'}](${clientData.url})` : (headers['referer'] || 'N/A'), inline: true },
    { name: '📌 Page Title', value: clientData.title || 'N/A', inline: true },
    { name: '🔗 Referrer', value: clientData.referrer || headers['referer'] || 'Direct / None', inline: true },
    { name: '💻 OS / Platform', value: clientData.platform || 'N/A', inline: true },
    { name: '🖥️ Screen / Viewport', value: `${clientData.screenResolution || 'N/A'} (Viewport: ${clientData.viewport || 'N/A'})`, inline: true },
    { name: '🌐 Language / Timezone', value: `${clientData.language || acceptLanguage} (${clientData.timeZone || 'UTC'})`, inline: true },
    { name: '⚡ CPU Cores / RAM', value: `${clientData.cores || 'N/A'} / ${clientData.memory || 'N/A'}`, inline: true },
    { name: '📶 Network Connection', value: clientData.connection || 'N/A', inline: true },
    { name: '🎨 Theme / Touch', value: `${clientData.colorScheme || 'N/A'} (${clientData.touchPoints || 0} touch pts)`, inline: true },
    { name: '🕒 Timestamp (UTC)', value: timestamp, inline: true },
    { name: '🔍 User-Agent', value: `\`\`\`${userAgent}\`\`\`` }
  ];

  const payload = {
    username: 'Visitor Telemetry Logger',
    embeds: [
      {
        title: '📊 Comprehensive Visitor Logged',
        color: 3447003, // Hex #3498DB
        fields: fields,
        timestamp: timestamp,
        footer: {
          text: 'Netlify Functions Telemetry'
        }
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
      body: JSON.stringify({ status: 'success', message: 'Comprehensive visitor telemetry logged' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to deliver webhook payload', details: error.message })
    };
  }
}
