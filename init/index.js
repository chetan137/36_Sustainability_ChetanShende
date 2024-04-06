 
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const Dataset = require('./models/Dataset');

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/smartgrid', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');

    // Read and parse CSV file
    fs.createReadStream('your_data.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        // Create a new Dataset document and save it to MongoDB
        try {
          const newDataset = new Dataset({
            dateTime: new Date(row.dateTime),
            airTemperature: parseFloat(row.airTemperature),
            pressure: parseFloat(row.pressure),
            windSpeed: parseFloat(row.windSpeed),
            powerGenerated: parseFloat(row.powerGenerated)
          });
          await newDataset.save();
          console.log('Data inserted:', newDataset);
        } catch (error) {
          console.error('Error inserting data:', error);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        process.exit(0);
      });
  })
  .catch((error) => console.error('MongoDB connection error:', error));
