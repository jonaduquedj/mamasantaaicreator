exports.handler = async function (event) {
  console.log('✅ generate-image mock function invoked');

  try {
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt;
    const imageBase64 = body.imageBase64;

    const apiKey = event.headers['x-higgsfield-key'];
    const apiSecret = event.headers['x-higgsfield-secret'];

    // Validaciones básicas
    if (!apiKey || !apiSecret) {
      return {
        statusCode: 400,
        body: 'Missing Higgsfield API keys',
      };
    }

    if (!prompt || !imageBase64) {
      return {
        statusCode: 400,
        body: 'Missing prompt or image',
      };
    }

    // ✅ MOCK RESPONSE (imagen simulada)
    return {
      statusCode: 200,
      body: JSON.stringify({
        image_url: 'https://via.placeholder.com/600x600?text=AI+Image',
      }),
    };

  } catch (err) {
    console.error('❌ Mock function error:', err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};