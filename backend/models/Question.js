import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Please add a question text']
  },
  optionType: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  options: {
    type: [String],
    required: [true, 'Please provide options'],
    validate: [arrayLimit, 'Options should be between 2 and 6']
  },
  correctAnswer: {
    type: Number, // Index of the correct option
    required: [true, 'Please specify the correct answer index']
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length >= 2 && val.length <= 6;
}

const Question = mongoose.model('Question', questionSchema);
export default Question;
