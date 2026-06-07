import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true
  },
  participantName: {
    type: String,
    required: [true, 'Please add a participant name']
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  percentage: {
    type: Number,
    required: true,
    default: 0
  },
  completionTime: {
    type: Number, // in seconds or milliseconds
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for answers
attemptSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'attemptId',
  justOne: false
});

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;
