// Utility helpers
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function pollStatus(statusUrl, headers, interval = 3000) {
  while (true) {
    const res = await fetch(statusUrl, { headers });
    const data = await res.json();

    if (data.status === 'completed') return data;
    if (data.status === 'failed' || data.status === 'nsfw') {
      throw new Error(`Generation ${data.status}`);
    }

    await new Promise(r => setTimeout(r, interval));
  }
}