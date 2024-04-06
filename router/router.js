const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const Dataset = require('../models/Dataset');


const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), (req, res) => {

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', data => results.push(data))
    .on('end', () => {

        Dataset.insertMany(results)
        .then(() => res.status(201).json({ message: 'Dataset uploaded successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
    });
});

module.exports = router;
