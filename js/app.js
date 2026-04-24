import { generateImage } from './api.js'

/* =========================
   HELPERS
========================= */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // ⚠️ Quitamos el prefijo data:image/...
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/* =========================
   ELEMENTS
========================= */

const fileInput = document.getElementById('referenceImage')
const uploadBox = document.querySelector('.upload-box')
const previewContainer = document.querySelector('.upload-preview')
const previewImg = document.querySelector('.upload-preview img')

const promptInput = document.getElementById('imagePrompt')
const promptChips = document.querySelectorAll('.prompt-chip')

const generateBtn = document.getElementById('generateBtn')

const outputImg = document.getElementById('outputImage')
const previewPlaceholder = document.querySelector('.preview-placeholder')

let currentImageBase64 = null

/* =========================
   IMAGE UPLOAD + PREVIEW ✅
========================= */

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0]
  if (!file) return

  // ✅ Mostrar preview visual
  previewImg.src = URL.createObjectURL(file)
  previewContainer.style.display = 'block'
  uploadBox.classList.add('has-image')

  // ✅ Convertir a base64 para backend
  currentImageBase64 = await fileToBase64(file)
})

/* =========================
   PROMPT CHIPS ✅
========================= */

promptChips.forEach(chip => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.textContent.trim()
    promptInput.focus()
  })
})

/* =========================
   GENERATE IMAGE ✅
========================= */

generateBtn.addEventListener('click', async () => {
  try {
    if (!currentImageBase64) {
      alert('Please upload a reference image first.')
      return
    }

    const prompt = promptInput.value.trim()
    if (!prompt) {
      alert('Please write or select an image prompt.')
      return
    }

    // UI state
    generateBtn.disabled = true
    const originalText = generateBtn.textContent
    generateBtn.textContent = 'Generating...'

    // 🔥 Call backend (Higgsfield)
    const data = await generateImage(prompt, currentImageBase64)

    // ✅ Mostrar imagen generada
    outputImg.src = data.image_url
    outputImg.style.display = 'block'
    previewPlaceholder.style.display = 'none'

  } catch (err) {
    console.error('Frontend error:', err)
    alert('Error generating image')
  } finally {
    generateBtn.disabled = false
    generateBtn.textContent = 'Generate Image'
  }
})