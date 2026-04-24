import { generateImage } from './api.js'

/* ========= HELPERS ========= */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/* ========= ELEMENTS ========= */

const fileInput = document.getElementById('referenceImage')
const previewContainer = document.querySelector('.upload-preview')
const previewImg = document.querySelector('.preview-image')
const promptInput = document.getElementById('imagePrompt')
const generateBtn = document.getElementById('generateBtn')
const outputImg = document.getElementById('outputImage')
const placeholder = document.querySelector('.preview-placeholder')
const promptChips = document.querySelectorAll('.prompt-chip')

let currentImageBase64 = null

/* ========= IMAGE PREVIEW ✅ ========= */

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0]
  if (!file) return

  previewImg.src = URL.createObjectURL(file)
  previewContainer.style.display = 'block'

  currentImageBase64 = await fileToBase64(file)
})

/* ========= PROMPT CHIPS ✅ ========= */

promptChips.forEach(chip => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.textContent.trim()
    promptInput.focus()
  })
})

/* ========= GENERATE IMAGE ✅ ========= */

generateBtn.addEventListener('click', async () => {
  try {
    if (!currentImageBase64) {
      alert('Please upload a reference image.')
      return
    }

    if (!promptInput.value.trim()) {
      alert('Please write or select a prompt.')
      return
    }

    generateBtn.disabled = true
    generateBtn.textContent = 'Generating...'

    const data = await generateImage(
      promptInput.value.trim(),
      currentImageBase64
    )

    outputImg.src = data.image_url
    outputImg.style.display = 'block'
    placeholder.style.display = 'none'

  } catch (err) {
    alert('Error generating image')
    console.error(err)
  } finally {
    generateBtn.disabled = false
    generateBtn.textContent = 'Generate Image'
  }
})