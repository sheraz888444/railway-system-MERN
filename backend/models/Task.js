import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['passenger_assistance', 'maintenance', 'security', 'cleaning', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  location: {
    type: String // e.g., platform number, train number
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
