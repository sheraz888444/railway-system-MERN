import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['daily', 'incident', 'maintenance', 'passenger_feedback'],
    default: 'daily'
  },
  content: {
    type: String,
    required: true
  },
  metrics: {
    passengersAssisted: { type: Number, default: 0 },
    issuesResolved: { type: Number, default: 0 },
    trainsMonitored: { type: Number, default: 0 },
    delaysReported: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed'],
    default: 'draft'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComments: {
    type: String
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
