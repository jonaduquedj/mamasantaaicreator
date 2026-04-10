exports.handler = async function (event) {
  console.log('✅ generate-video mock function invoked');

  try {
    const body = JSON.parse(event.body || '{}');
    const imageUrl = body.image_url;
    const motionPrompt = body.motion_prompt;

    const apiKey = event.headers['x-higgsfield-key'];
    const apiSecret = event.headers['x-higgsfield-secret'];

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 400,
        body: 'Missing Higgsfield API keys',
      };
    }

    if (!imageUrl || !motionPrompt) {
      return {
        statusCode: 400,
        body: 'Missing image or motion prompt',
      };
    }

    // ✅ MOCK VIDEO RESPONSE
    return {
      statusCode: 200,
      body: JSON.stringify({
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }),
    };

  } catch (err) {
    console.error('❌ generate-video mock error:', err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};