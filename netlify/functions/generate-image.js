exports.handler = async function (event) {
  console.log('✅ generate-image function invoked');

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt;
    const imageBase64 = body.imageBase64;

    // Read API keys from headers
    const apiKey = event.headers['x-higgsfield-key'];
    const apiSecret = event.headers['x-higgsfield-secret'];

    // Validate inputs
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

    // Call Higgsfield API
    const response = await fetch('https://platform.higgsfield.ai/api/v1/image', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        prompt,
        reference_image: imageBase64,
        aspect_ratio: '1:1',
        resolution: '1080p',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Higgsfield error:', errorText);
      return {
        statusCode: 500,
        body: errorText,
      };
    }

    const data = await response.json();

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({
        image_url: data.image_url,
      }),
    };

  } catch (err) {
    console.error('❌ Function crash:', err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
