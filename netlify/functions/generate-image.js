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
    const apiSecret = process.env.HIGGSFIELD_API_SECRET

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Higgsfield API keys not configured' })
      }
    }

    // 🔹 Llamada a Higgsfield (IMAGEN REAL)
    const response = await fetch('https://api.higgsfield.ai/v1/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-SECRET': apiSecret
      },
      body: JSON.stringify({
        prompt: prompt,
        reference_image: imageBase64 || null,
        width: 1024,
        height: 1024,
        steps: 30
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Higgsfield error:', data)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error generating image with Higgsfield' })
      }
    }

    // ✅ Higgsfield devuelve URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        image_url: data.image_url
      })
    }

  } catch (err) {
    console.error('Backend error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}