/* =====================================================
   APP INIT — WAIT FOR DOM
===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     GLOBAL STATE
  ===================================================== */
  let lastGeneratedImageUrl = null;

  /* =====================================================
     TABS
  ===================================================== */
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    };
  });

  /* =====================================================
     SETTINGS MODAL
  ===================================================== */
  const settingsModal = document.getElementById('settingsModal');
  const openSettingsBtn = document.getElementById('openSettings');
  const closeSettingsBtn = document.getElementById('closeSettings');
  const saveApiKeysBtn = document.getElementById('saveApiKeys');

  openSettingsBtn.onclick = () => settingsModal.classList.remove('hidden');
  closeSettingsBtn.onclick = () => settingsModal.classList.add('hidden');

  saveApiKeysBtn.onclick = () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const apiSecret = document.getElementById('apiSecret').value.trim();

    if (!apiKey || !apiSecret) {
      alert('Please enter both API Key and API Secret.');
      return;
    }

    localStorage.setItem('higgsfield_api_key', apiKey);
    localStorage.setItem('higgsfield_api_secret', apiSecret);
    settingsModal.classList.add('hidden');
    console.log('✅ Higgsfield API keys saved');
  };

  /* =====================================================
     IMAGE MODE TOGGLE (SINGLE / BATCH)
  ===================================================== */
  const toggleOptions = document.querySelectorAll('.toggle-option');
  const imageInput = document.getElementById('referenceImage');

  toggleOptions.forEach(option => {
    option.addEventListener('click', () => {
      toggleOptions.forEach(btn => btn.classList.remove('active'));
      option.classList.add('active');

      const isBatch = option.textContent.includes('Batch');
      if (isBatch) imageInput.setAttribute('multiple', 'multiple');
      else imageInput.removeAttribute('multiple');
    });
  });

  /* =====================================================
     PROMPT CHIPS
  ===================================================== */
  const promptTextarea = document.querySelector('#image textarea');

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      promptTextarea.value = chip.textContent.trim();
      promptTextarea.focus();
    });
  });

  /* =====================================================
     IMAGE PREVIEW (UPLOAD)
  ===================================================== */
  const previewUploadBox = document.querySelector('#image .upload-box');
  const previewContainer = previewUploadBox.querySelector('.upload-preview');

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      previewContainer.innerHTML = `<img src="${reader.result}" />`;
      previewContainer.style.display = 'block';
      previewUploadBox.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });

  /* =====================================================
     HELPER — FILE TO BASE64
  ===================================================== */
  function readFileAsBase64(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  }

  /* =====================================================
     GENERATE IMAGE (MOCK)
  ===================================================== */
  const generateImageBtn = document.querySelector('#image .primary-action');
  const previewPanel = document.querySelector('#image .preview-panel');

  generateImageBtn.addEventListener('click', async () => {
    console.log('🔥 Generate Image button clicked');

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

      previewPanel.textContent = 'Generating image...';

      const imageBase64 = await readFileAsBase64(file);

      const response = await fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-higgsfield-key': apiKey,
          'x-higgsfield-secret': apiSecret
        },
        body: JSON.stringify({ prompt, imageBase64 })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();

      lastGeneratedImageUrl = result.image_url;

      previewPanel.innerHTML = `
  <img src="${lastGeneratedImageUrl}" />

  <div class="result-actions">
    <button id="downloadImage" class="secondary-action">Download</button>
    <button id="regenerateImage" class="secondary-action">Regenerate</button>
    <button id="createVideo" class="primary-action">Create Video</button>
  </div>
`;

      activateResultButtons();

    } catch (err) {
      console.error(err);
      previewPanel.textContent = 'Generation failed';
    }
  });

  /* =====================================================
     RESULT BUTTONS
  ===================================================== */
  function activateResultButtons() {
    const downloadBtn = document.getElementById('downloadImage');
    const regenerateBtn = document.getElementById('regenerateImage');
    const createVideoBtn = document.getElementById('createVideo');

    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = lastGeneratedImageUrl;
      a.download = 'generated-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    regenerateBtn.onclick = () => {
      generateImageBtn.click();
    };

    createVideoBtn.onclick = () => {
      document.querySelector('[data-tab="video"]').click();

      const videoPreview = document.querySelector('#video .upload-preview');
      videoPreview.innerHTML = `<img src="${lastGeneratedImageUrl}" />`;
      videoPreview.style.display = 'block';
      videoPreview.parentElement.classList.add('has-image');

      console.log('🎬 Image passed to Video Generation');
    };
  }

});