import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Train from './models/Train.js';
import StaffAssignment from './models/StaffAssignment.js';
import Task from './models/Task.js';
import Report from './models/Report.js';

dotenv.config();

const seedStaffData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create staff users
    const staffUsers = [
      {
        name: 'John Doe',
        email: 'staff1@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'staff'
      },
      {
        name: 'Jane Smith',
        email: 'staff2@example.com',
        password: 'password123',
        phone: '0987654321',
        role: 'staff'
      }
    ];

    const createdStaff = await User.insertMany(staffUsers);
    console.log('Staff users created');

    // Get existing trains
    const trains = await Train.find({});
    if (trains.length === 0) {
      console.log('No trains found, please seed trains first');
      return;
    }

    // Create staff assignments
    const assignments = [
      {
        staffId: createdStaff[0]._id,
        trainId: trains[0]._id,
        shift: 'morning'
      },
      {
        staffId: createdStaff[1]._id,
        trainId: trains[1]._id,
        shift: 'afternoon'
      }
    ];

    await StaffAssignment.insertMany(assignments);
    console.log('Staff assignments created');

    // Create tasks
    const tasks = [
      {
        staffId: createdStaff[0]._id,
        title: 'Assist passengers at platform 1',
        description: 'Help passengers with boarding and luggage',
        type: 'passenger_assistance',
        priority: 'medium',
        dueDate: new Date(),
        location: 'Platform 1'
      },
      {
        staffId: createdStaff[0]._id,
        title: 'Clean train compartments',
        description: 'Ensure all compartments are clean before departure',
        type: 'cleaning',
        priority: 'high',
        dueDate: new Date(),
        location: trains[0].trainNumber
      },
      {
        staffId: createdStaff[1]._id,
        title: 'Security check',
        description: 'Perform security checks on passengers',
        type: 'security',
        priority: 'high',
        dueDate: new Date(),
        location: 'Entrance'
      }
    ];

    await Task.insertMany(tasks);
    console.log('Tasks created');

    // Create sample reports
    const reports = [
      {
        staffId: createdStaff[0]._id,
        type: 'daily',
        content: 'Completed all assigned tasks. Assisted 15 passengers. No incidents reported.',
        metrics: {
          passengersAssisted: 15,
          issuesResolved: 2,
          trainsMonitored: 1,
          delaysReported: 0
        },
        status: 'submitted'
      },
      {
        staffId: createdStaff[1]._id,
        type: 'incident',
        content: 'Minor delay due to technical issue. Resolved within 10 minutes.',
        metrics: {
          passengersAssisted: 8,
          issuesResolved: 1,
          trainsMonitored: 1,
          delaysReported: 1
        },
        status: 'submitted'
      }
    ];

    await Report.insertMany(reports);
    console.log('Reports created');

    console.log('Staff data seeded successfully!');
  } catch (error) {
    console.error('Error seeding staff data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedStaffData();
