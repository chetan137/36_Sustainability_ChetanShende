
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const csvParser = require('csv-parser');
const fs = require('fs');
const Dataset = require('./models/Dataset');




const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/hack', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const upload = multer({ dest: 'uploads/' });

app.get('/datasets/upload', (req, res) => {
  res.render('upload');
});









app.post('/datasets/upload', upload.single('file'), (req, res) => {

  const results = [];
  let isFirstRow = true;

  fs.createReadStream(req.file.path)
    .pipe(csvParser({ headers: true }))
    .on('data', data => {
      if (isFirstRow) {
        isFirstRow = false;
        return;

      }

      console.log('Raw data:', data);



      if (data.date && data.date.trim() !== '') {
        const dateTimeParts = data.date.split(' ');
        if (dateTimeParts.length === 2) {
          const dateParts = dateTimeParts[0].split('-');
          const timeParts = dateTimeParts[1].split(':');
          const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);

          console.log('Parsed date:', formattedDate);


          const formattedData = {
            dateTime: formattedDate,
            airTemperature: parseFloat(data.airTemperature),
            pressure: parseFloat(data.pressure),
            windSpeed: parseFloat(data.windSpeed),
            powerGenerated: parseFloat(data.powerGenerated)
          };


          if (!isNaN(formattedData.dateTime.getTime()) &&
            !isNaN(formattedData.airTemperature) &&
            !isNaN(formattedData.pressure) &&
            !isNaN(formattedData.windSpeed) &&
            !isNaN(formattedData.powerGenerated)) {
            results.push(formattedData);
          } else {

            return res.status(400).json({ error: 'Invalid data format' });
          }
        } else {

          return res.status(400).json({ error: 'Invalid dateTime format' });
        }
      } else {

        return res.status(400).json({ error: 'Date field is missing or empty' });
      }
    })
    .on('end', () => {

      Dataset.insertMany(results)
        .then(() => {

          fs.unlinkSync(req.file.path);
          res.status(201).json({ message: 'Dataset uploaded successfully' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    });
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
