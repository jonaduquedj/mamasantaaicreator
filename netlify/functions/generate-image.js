export async function handler(event) {
  try {
    const { imageBase64, prompt } = JSON.parse(event.body);

    // 🔐 API Keys ingresadas por el usuario (desde frontend)
    const apiKey = event.headers['x-higgsfield-key'];
    const apiSecret = event.headers['x-higgsfield-secret'];

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 401,
        body: 'Missing Higgsfield API keys',
      };
    }

    // ⚠️ Llamada REAL a Higgsfield (backend context)
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
        resolution: '1080p'
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: 500, body: errText };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        image_url: data.image_url,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}
