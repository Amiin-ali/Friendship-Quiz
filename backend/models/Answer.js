import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  attemptId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Attempt',
    required: true
  },
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOption: {
    type: Number, // Index of selected option
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;
