import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Train from './models/Train.js';

dotenv.config();

const sampleTrains = [
  {
    trainNumber: '12345',
    trainName: 'Delhi Mumbai Express',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: '08:00',
    arrivalTime: '20:00',
    duration: '12h 0m',
    runningDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    distance: 1447,
    amenities: ['WiFi', 'AC', 'Food'],
    status: 'active',
    seats: [
      // 1A - First AC
      { seatNumber: '1A', class: '1A', price: 3200, isBooked: false },
      { seatNumber: '2A', class: '1A', price: 3200, isBooked: false },
      { seatNumber: '3A', class: '1A', price: 3200, isBooked: false },
      { seatNumber: '4A', class: '1A', price: 3200, isBooked: false },

      // 2A - Second AC
      { seatNumber: '5A', class: '2A', price: 2400, isBooked: false },
      { seatNumber: '6A', class: '2A', price: 2400, isBooked: false },
      { seatNumber: '7A', class: '2A', price: 2400, isBooked: false },
      { seatNumber: '8A', class: '2A', price: 2400, isBooked: false },
      { seatNumber: '9A', class: '2A', price: 2400, isBooked: false },
      { seatNumber: '10A', class: '2A', price: 2400, isBooked: false },

      // 3A - Third AC
      { seatNumber: '11A', class: '3A', price: 1800, isBooked: false },
      { seatNumber: '12A', class: '3A', price: 1800, isBooked: false },
      { seatNumber: '13A', class: '3A', price: 1800, isBooked: false },
      { seatNumber: '14A', class: '3A', price: 1800, isBooked: false },
      { seatNumber: '15A', class: '3A', price: 1800, isBooked: false },
      { seatNumber: '16A', class: '3A', price: 1800, isBooked: false },

      // SL - Sleeper
      { seatNumber: '17A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '18A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '19A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '20A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '21A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '22A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '23A', class: 'SL', price: 500, isBooked: false },
      { seatNumber: '24A', class: 'SL', price: 500, isBooked: false },

      // CC - Chair Car
      { seatNumber: '25A', class: 'CC', price: 800, isBooked: false },
      { seatNumber: '26A', class: 'CC', price: 800, isBooked: false },
      { seatNumber: '27A', class: 'CC', price: 800, isBooked: false },
      { seatNumber: '28A', class: 'CC', price: 800, isBooked: false },

      // 2S - Second Sitting
      { seatNumber: '29A', class: '2S', price: 300, isBooked: false },
      { seatNumber: '30A', class: '2S', price: 300, isBooked: false },
      { seatNumber: '31A', class: '2S', price: 300, isBooked: false },
      { seatNumber: '32A', class: '2S', price: 300, isBooked: false },
    ]
  },
  {
    trainNumber: '67890',
    trainName: 'Mumbai Chennai Express',
    source: 'Mumbai',
    destination: 'Chennai',
    departureTime: '22:00',
    arrivalTime: '10:00',
    duration: '12h 0m',
    runningDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    distance: 1338,
    amenities: ['WiFi', 'AC'],
    status: 'active',
    seats: [
      // Similar seat structure for this train
      { seatNumber: '1B', class: '1A', price: 3100, isBooked: false },
      { seatNumber: '2B', class: '1A', price: 3100, isBooked: false },
      { seatNumber: '3B', class: '2A', price: 2300, isBooked: false },
      { seatNumber: '4B', class: '2A', price: 2300, isBooked: false },
      { seatNumber: '5B', class: '3A', price: 1700, isBooked: false },
      { seatNumber: '6B', class: '3A', price: 1700, isBooked: false },
      { seatNumber: '7B', class: 'SL', price: 450, isBooked: false },
      { seatNumber: '8B', class: 'SL', price: 450, isBooked: false },
      { seatNumber: '9B', class: 'CC', price: 750, isBooked: false },
      { seatNumber: '10B', class: 'CC', price: 750, isBooked: false },
      { seatNumber: '11B', class: '2S', price: 250, isBooked: false },
      { seatNumber: '12B', class: '2S', price: 250, isBooked: false },
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing trains
    await Train.deleteMany({});
    console.log('Cleared existing trains');

    // Insert sample trains
    await Train.insertMany(sampleTrains);
    console.log('Sample trains inserted successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();
