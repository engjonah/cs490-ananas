const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  inputLang: {
    type: String,
    required: true,
  },
  outputLang: {
    type: String,
    required: true,
  },
  translationId: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    default: '',
  },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
