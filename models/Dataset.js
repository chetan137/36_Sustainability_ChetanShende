const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  dateTime: { type: Date },
  airTemperature: { type: Number },
  pressure: { type: Number },
  windSpeed: { type: Number },
  powerGenerated: { type: Number }
});

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
