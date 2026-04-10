import { API_ENDPOINTS } from './config.js';

/* =========================
   IMAGE GENERATION (FRONTEND)
========================= */
export async function generateImageAPI(payload) {
  const apiKey = localStorage.getItem('higgsfield_api_key');
  const apiSecret = localStorage.getItem('higgsfield_api_secret');

  const res = await fetch(API_ENDPOINTS.IMAGE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-higgsfield-key': apiKey,
      'x-higgsfield-secret': apiSecret,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
}

/* =========================
   VIDEO GENERATION (FRONTEND)
========================= */
export async function generateVideoAPI(payload) {
  const apiKey = localStorage.getItem('higgsfield_api_key');
  const apiSecret = localStorage.getItem('higgsfield_api_secret');

  const res = await fetch(API_ENDPOINTS.VIDEO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-higgsfield-key': apiKey,
      'x-higgsfield-secret': apiSecret,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
}