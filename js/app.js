document.querySelectorAll('.tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');document.getElementById(tab.dataset.tab).classList.add('active')};});
const modal=document.getElementById('settingsModal');document.getElementById('openSettings').onclick=()=>modal.classList.remove('hidden');document.getElementById('closeSettings').onclick=()=>modal.classList.add('hidden');
// ==============================
// Generation Mode Toggle Logic
//

const toggleOptions = document.querySelectorAll('.toggle-option');
const imageInput = document.getElementById('referenceImage');


toggleOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove active class from both
    toggleOptions.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked
    option.classList.add('active');

    // Check mode
    const isBatch = option.textContent.includes('Batch');

    // Enable or disable multiple file upload
    if (isBatch) {
      imageInput.setAttribute('multiple', 'multiple');
    } else {
      imageInput.removeAttribute('multiple');
    }
  });
});
// ==============================
// Suggested Prompt Click Logic
// ==============================

const promptTextarea = document.querySelector(
  '#image textarea'
);

const promptChips = document.querySelectorAll('.prompt-chip');

promptChips.forEach(chip => {
  chip.addEventListener('click', () => {
    promptTextarea.value = chip.textContent.trim();
    promptTextarea.focus();
  });
});

// ======================================
// AI Prompt Suggestions (SIMULATED - SAFE)
// ======================================

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('suggestion-button')) return;

  const imageSection = document.getElementById('image');
  const promptTextarea = imageSection.querySelector('textarea');
  const promptList = imageSection.querySelector('.prompt-list');

  if (!promptTextarea || !promptList) {
    console.warn('Prompt textarea or prompt list not found');
    return;
  }

  // Simulated AI response
  const simulatedSuggestions = [
    'Luxury fashion editorial, studio lighting, clean background',
    'Instagram lifestyle content, natural light, premium aesthetic',
    'High-end fashion portrait, cinematic tones',
    'Minimalist product-focused fashion shot, elegant mood'
  ];

  // Clear existing prompts
  promptList.innerHTML = '';

  // Inject new prompt chips
  simulatedSuggestions.forEach(text => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'prompt-chip';
    btn.textContent = text;

    btn.addEventListener('click', () => {
      promptTextarea.value = text;
      promptTextarea.focus();
    });

    promptList.appendChild(btn);
  });
});

// ==================================
// Higgsfield API Keys Modal Logic
// ==================================

const settingsModal = document.getElementById('settingsModal');
const openSettingsBtn = document.getElementById('openSettings');
const closeSettingsBtn = document.getElementById('closeSettings');
const saveApiKeysBtn = document.getElementById('saveApiKeys');

const apiKeyInput = document.getElementById('apiKey');
const apiSecretInput = document.getElementById('apiSecret');

// Open modal
openSettingsBtn.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});

// Close modal
closeSettingsBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

// Save keys and close modal
saveApiKeysBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  const apiSecret = apiSecretInput.value.trim();

  if (!apiKey || !apiSecret) {
    alert('Please enter both API Key and API Secret.');
    return;
  }

  localStorage.setItem('higgsfield_api_key', apiKey);
  localStorage.setItem('higgsfield_api_secret', apiSecret);

  settingsModal.classList.add('hidden');

  console.log('✅ Higgsfield API keys saved');
});
// ==============================
// SAFE IMAGE PREVIEW (NO BREAKS ANYTHING)
// ==============================

const previewInput = document.getElementById('referenceImage');
const previewUploadBox = document.querySelector('#image .upload-box');
const previewContainer = previewUploadBox.querySelector('.upload-preview');

previewInput.addEventListener('change', () => {
  const file = previewInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewContainer.innerHTML = `<img src="${reader.result}" />`;
    previewContainer.style.display = 'block';
    previewUploadBox.classList.add('has-image');
  };
  reader.readAsDataURL(file);
});

// ==============================
// HIGGSFIELD HELPERS
// ==============================

function readFileAsBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
}

async function pollHiggsfield(statusUrl, headers) {
  while (true) {
    const res = await fetch(statusUrl, { headers });
    const data = await res.json();

    if (data.status === 'completed') return data;
    if (data.status === 'failed' || data.status === 'nsfw') {
      throw new Error('Generation failed');
    }

    await new Promise(r => setTimeout(r, 3000));
  }
}
// ==============================
// GENERATE IMAGE (SAFE VERSION)
// ==============================

const generateImageBtn = document.querySelector('#image .primary-action');
const previewPanel = document.querySelector('#image .preview-panel');

generateImageBtn.addEventListener('click', async () => {
  try {
    const file = imageInput.files[0];
    const prompt = promptTextarea.value.trim();

    if (!file || !prompt) {
      alert('Upload image and enter prompt');
      return;
    }

    const apiKey = localStorage.getItem('higgsfield_api_key');
    const apiSecret = localStorage.getItem('higgsfield_api_secret');
    if (!apiKey || !apiSecret) {
      alert('Add Higgsfield API keys');
      return;
    }

    previewPanel.innerHTML = 'Generating image...';

    const imageBase64 = await readFileAsBase64(file);

    const headers = {
      'Authorization': `Key ${apiKey}:${apiSecret}`,
      'Content-Type': 'application/json'
    };

    const submitRes = await fetch(
  'https://platform.higgsfield.ai/nano-banana-pro/',
  {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      reference_image: imageBase64,
      aspect_ratio: '1:1',
      resolution: '1080p'
    })
  }
);

// ✅ VALIDACIÓN CLAVE
if (!submitRes.ok) {
  const errorText = await submitRes.text();
  console.error('Higgsfield error response:', errorText);
  throw new Error('Higgsfield request failed');
}

const submitData = await submitRes.json();

    const result = await pollHiggsfield(submitData.status_url, headers);

    previewPanel.innerHTML = `<img src="${result.images[0].url}" style="width:100%;border-radius:16px">`;

  } catch (err) {
    console.error(err);
    previewPanel.innerHTML = 'Generation failed';
  }
});

// ==============================
// SAFE VIDEO IMAGE PREVIEW
// ==============================

const videoInput = document.getElementById('videoRef');
const videoUploadBox = document.querySelector('#video .upload-box');
const videoPreview = videoUploadBox.querySelector('.upload-preview');

videoInput.addEventListener('change', () => {
  const file = videoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    videoPreview.innerHTML = `<img src="${reader.result}" />`;
    videoPreview.style.display = 'block';
    videoUploadBox.classList.add('has-image');
  };
  reader.readAsDataURL(file);
});

// ==============================
// GENERATE VIDEO — BASE VALIDATION
// ==============================

const generateVideoBtn = document.querySelector('#video .primary-action');
const videoPromptTextarea = document.querySelector('#video textarea');

generateVideoBtn.addEventListener('click', () => {
  const file = videoInput.files[0];
  const motionPrompt = videoPromptTextarea.value.trim();

  if (!file) {
    alert('Please upload a source image for the video.');
    return;
  }

  if (!motionPrompt) {
    alert('Please enter a motion prompt.');
    return;
  }

  const apiKey = localStorage.getItem('higgsfield_api_key');
  const apiSecret = localStorage.getItem('higgsfield_api_secret');

  if (!apiKey || !apiSecret) {
    alert('Please add your Higgsfield API keys.');
    return;
  }

  alert('✅ Video input and motion prompt ready (generation will run in Netlify)');
});