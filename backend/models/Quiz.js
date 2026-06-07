import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete questions and attempts when a quiz is deleted
quizSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Question').deleteMany({ quizId: this._id });
  await this.model('Attempt').deleteMany({ quizId: this._id });
  next();
});

// Virtual for questions
quizSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quizId',
  justOne: false
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
