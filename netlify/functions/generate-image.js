exports.handler = async function (event) {
  try {
    const { prompt, imageBase64 } = JSON.parse(event.body || '{}');

    if (!prompt || !imageBase64) {
      return {
        statusCode: 400,
        body: 'Missing prompt or reference image'
      };
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: 'Google AI API key not configured'
      };
    }

    // ✅ Call Google Image (Imagen / Nano Banana 2)
    const response = await fetch(
      `https://generativeai.googleapis.com/v1beta/images:generate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'imagen-3',   // ✅ Ajustable si Google usa otro alias
          prompt: prompt,
          image: {
            content: imageBase64
          },
          size: '1024x1024'
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google Image error:', errText);
      return {
        statusCode: 500,
        body: errText
      };
    }

    const data = await response.json();

    // ✅ Normalize response for frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        image_url: data.images[0].url
      })
    };

  } catch (err) {
    console.error('Generate image error:', err);
    return {
      statusCode: 500,
      body: 'Image generation failed'
    };
  }
};