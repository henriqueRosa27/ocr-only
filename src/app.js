var express = require("express");
const multer = require("multer");
const tesseract = require("tesseract.js");

const multerConfig = require("./multer");

var app = express();
const routes = new express.Router();
const upload = multer(multerConfig);

routes.get("/", async (req, res) => {
  res.send("Hello World!");
});

routes.post("/ocr", upload.single("image"), async (req, res) => {
  const worker = tesseract.createWorker();

  await worker.load();
  await worker.loadLanguage("por");
  await worker.initialize("por");

  const {
    data: { text },
  } = await worker.recognize(req.file.path);

  await worker.terminate();

  res.json({ text, file: req.file });
});

app.use(routes);

app.listen(3000, function () {
  console.log("Example app ocr listening on port 3000!");
});
