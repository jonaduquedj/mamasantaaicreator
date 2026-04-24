export async function handler(event) {
  try {
    const { prompt, imageBase64 } = JSON.parse(event.body || '{}')

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing prompt' })
      }
    }

    const apiKey = process.env.HIGGSFIELD_API_KEY
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'HIGGSFIELD_API_KEY not configured' })
      }
    }

    // 1️⃣ Call Higgsfield Image Generation
    const response = await fetch(
      'https://api.higgsfield.ai/v1/image/generate', // ⚠️ usa el endpoint real de Higgsfield
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: prompt,
          reference_image: imageBase64 || null,
          width: 1024,
          height: 1024,
          steps: 30,
          guidance: 7.5
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Higgsfield error:', data)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Higgsfield image generation failed' })
      }
    }

    // ✅ Higgsfield devuelve URL directa
    return {
      statusCode: 200,
      body: JSON.stringify({
        image_url: data.image_url
      })
    }

  } catch (err) {
    console.error('Generate image error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
