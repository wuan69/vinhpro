// .netlify/functions/sendTelegram.js

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing Telegram BOT_TOKEN or CHAT_ID environment variables.');
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, phone, age, experience, goal, time, message, source } = data;

    // Validate required fields basic
    if (!name || !phone) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: 'Name and Phone are required' })
      };
    }

    const text = `
🏀 *NEW LEAD* (${source || 'Website'})
*Name:* ${name}
*Phone:* ${phone}
*Age:* ${age || 'N/A'}
*Experience:* ${experience || 'N/A'}
*Goal:* ${goal || 'N/A'}
*Preferred Time:* ${time || 'N/A'}
*Message:* ${message || 'N/A'}
*Submitted:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}
    `.trim();

    // Use built-in fetch (available in Node 18+)
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Telegram API error:', errorData);
      throw new Error('Telegram API rejected the request');
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, message: 'Lead sent successfully' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
