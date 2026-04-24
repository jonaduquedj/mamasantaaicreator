export async function handler(event) {
  const { prompt, imageBase64 } = JSON.parse(event.body || {})

  const response = await fetch(
    'https://api.higgsfield.ai/v1/video/generate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        reference_image: imageBase64,
        duration: 8
      })
    }
  )

  const data = await response.json()

  return {
    statusCode: 200,
    body: JSON.stringify({
      video_url: data.video_url
    })
  }
}