require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/synthesize', async (req, res) => {
  const text = req.body.text
  if (text === undefined || text === null || text === '' || text === 0) {
    res.status(400).send({ error: 'Text is required.' })
    return
  }

  const voice =
    req.body.voice === 0
      ? '21m00Tcm4TlvDq8ikWAM'
      : req.body.voice || '21m00Tcm4TlvDq8ikWAM'

  const voice_settings =
    req.body.voice_settings === 0
      ? {
          stability: 0.8,
          similarity_boost: 0.8,
        }
      : req.body.voice_settings || {
          stability: 0.8,
          similarity_boost: 0.8,
        }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        text: text,
        voice_settings: voice_settings,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'audio/mpeg',
          'xi-api-key': `${process.env.ELEVENLABS_API_KEY}`,
        },
        responseType: 'arraybuffer',
      }
    )

    const audioBuffer = Buffer.from(response.data, 'binary')
    const base64Audio = audioBuffer.toString('base64')
    const audioDataURL = `data:audio/mpeg;base64,${base64Audio}`
    res.send({ audioDataURL })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error occurred while processing the request.')
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
