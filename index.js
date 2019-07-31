const express = require("express");
const fileUpload = require("express-fileupload");
const Tesseract = require("tesseract.js");

const app = express();
const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

// default options
const port = process.env.PORT || 3000;
app.use(fileUpload());
app.listen(port);

app.get("/", (req, res) => {
  res.send(`
    <form ref='uploadForm'
      id='uploadForm'
      action='/upload'
      method='post'
      encType="multipart/form-data">
        <input type="file" name="sampleFile" />
        <input type='submit' value='Upload!' />
    </form>
  `);
});

app.post("/upload", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  worker
    .recognize(sampleFile.data)
    .progress((progress) => {
      console.log(progress);
    })
    .then(({ text }) => {
      console.log(text);
      res.send(`<pre>${text}</pre>`);
      worker.terminate();
    });
});
