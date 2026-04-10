export async function handler(event) {
  try {
    const { sourceImage, motionPrompt } = JSON.parse(event.body);

    const apiKey = event.headers['x-higgsfield-key'];
    const apiSecret = event.headers['x-higgsfield-secret'];

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 401,
        body: 'Missing Higgsfield API keys',
      };
    }

    const response = await fetch('https://platform.higgsfield.ai/api/v1/video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/veo-3.1-i2v',
        image: sourceImage,
        prompt: motionPrompt,
        duration: 8,
        resolution: '1080p',
        aspect_ratio: '16:9',
        audio: true,
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
        video_url: data.video_url,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}
``