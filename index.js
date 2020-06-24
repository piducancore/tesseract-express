const express = require("express")
const fileUpload = require("express-fileupload")
const Tesseract = require("tesseract.js")

const app = express()

app.use(fileUpload())

app.get("/", (_, res) => {
  res.send(`
    <form action='/upload' method='post' encType="multipart/form-data">
      <input type="file" name="sampleFile" />
      <input type='submit' value='Upload!' />
    </form>`)
})

app.post("/upload", async (req, res) => {
  const { sampleFile } = req.files
  if (!sampleFile) return res.status(400).send("No files were uploaded.")
  try {
    const { data } = await Tesseract.recognize(sampleFile.data, "spa+eng", {
      logger: (m) => console.log(m),
    })
    res.send(`<pre>${data.text}</pre>`)
  } catch (error) {
    throw error
  }
})

app.listen(process.env.PORT || 3000)
