
exports.handler = async function (event) {
  console.log('✅ generate-image function invoked');

  try {
    const { prompt, imageBase64 } = JSON.parse(event.body);

    const apiKey = event.headers['x-higgsfield-key'];
    const apiSecret = event.headers['x-higgsfield-secret'];

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 400,
        body: 'Missing Higgsfield API keys'
      };


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
      const err = await response.text();
      return { statusCode: 500, body: err };
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
    const apiSecret = event.headers['x-higgsfield-secret'];

