import { generateImage } from './api.js'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result.split(',')[1]) // 🔥 sin data:image/...
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const fileInput = document.getElementById('referenceImage')
const promptInput = document.getElementById('imagePrompt')
const generateBtn = document.getElementById('generateBtn')
const outputImg = document.getElementById('outputImage')

generateBtn.addEventListener('click', async () => {
  try {
    const file = fileInput.files[0]
    if (!file) {
      alert('Selecciona una imagen')
      return
    }

    const imageBase64 = await fileToBase64(file)
    const prompt = promptInput.value

    const data = await generateImage(prompt, imageBase64)
    outputImg.src = data.image_url
    outputImg.style.display = 'block'

  } catch (err) {
    console.error(err)
    alert('Error generando imagen')
  }
})