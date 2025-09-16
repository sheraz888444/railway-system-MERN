import mongoose from 'mongoose';

const staffAssignmentSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    default: 'morning'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const StaffAssignment = mongoose.model('StaffAssignment', staffAssignmentSchema);

export default StaffAssignment;
