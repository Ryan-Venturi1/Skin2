// netlify/functions/isic-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // Example: /api/isic-proxy?query=diagnosis:melanoma&limit=5
    const queryParams = event.queryStringParameters || {};
    const queryString = new URLSearchParams(queryParams).toString();

    const isicUrl = `https://api.isic-archive.com/api/v2/images/search/?${queryString}`;

    // Fetch from ISIC
    const response = await fetch(isicUrl);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `ISIC API error: ${response.status}`
      };
    }

    // Convert to JSON
    const data = await response.json();

    // Return JSON with CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: 'Serverless function error'
    };
  }
};