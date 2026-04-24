export async function handler(event) {
  try {
    const { prompt, imageBase64 } = JSON.parse(event.body || '{}')

    if (!prompt || !imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing prompt or imageBase64' })
      }
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GOOGLE_AI_API_KEY not configured' })
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: imageBase64
                  }
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()

    const imagePart =
      data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)

    if (!imagePart) {
      console.error('Gemini response:', data)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Gemini did not return an image' })
      }
    }

    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url: imageUrl })
    }

  } catch (err) {
    console.error('Generate image error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}