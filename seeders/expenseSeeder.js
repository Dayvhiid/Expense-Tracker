import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

dotenv.config();

// Sample expense categories and their typical amounts
const expenseCategories = [
  { category: 'Groceries', minAmount: 20, maxAmount: 150 },
  { category: 'Transportation', minAmount: 5, maxAmount: 50 },
  { category: 'Utilities', minAmount: 30, maxAmount: 200 },
  { category: 'Entertainment', minAmount: 10, maxAmount: 80 },
  { category: 'Healthcare', minAmount: 15, maxAmount: 300 },
  { category: 'Dining Out', minAmount: 8, maxAmount: 75 },
  { category: 'Shopping', minAmount: 15, maxAmount: 250 },
  { category: 'Gas', minAmount: 25, maxAmount: 80 },
  { category: 'Insurance', minAmount: 50, maxAmount: 400 },
  { category: 'Internet', minAmount: 40, maxAmount: 100 },
];

// Sample descriptions for each category
const expenseDescriptions = {
  'Groceries': ['Weekly grocery shopping', 'Fresh produce', 'Meat and dairy', 'Household items', 'Snacks and beverages'],
  'Transportation': ['Bus fare', 'Taxi ride', 'Uber/Lyft', 'Train ticket', 'Parking fee'],
  'Utilities': ['Electricity bill', 'Water bill', 'Gas bill', 'Phone bill', 'Cable/Internet'],
  'Entertainment': ['Movie tickets', 'Concert', 'Streaming subscription', 'Games', 'Books'],
  'Healthcare': ['Doctor visit', 'Prescription medication', 'Dental checkup', 'Eye exam', 'Pharmacy'],
  'Dining Out': ['Restaurant dinner', 'Fast food lunch', 'Coffee shop', 'Takeout order', 'Food delivery'],
  'Shopping': ['Clothing', 'Electronics', 'Home decor', 'Personal care', 'Gifts'],
  'Gas': ['Gas station fill-up', 'Fuel for car', 'Gas for generator', 'Propane refill'],
  'Insurance': ['Car insurance', 'Health insurance', 'Home insurance', 'Life insurance'],
  'Internet': ['Monthly internet bill', 'WiFi upgrade', 'Mobile data plan', 'Cable package'],
};

// Helper function to get random number between min and max
const getRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random date within the last 3 months
const getRandomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  const timeDiff = now.getTime() - threeMonthsAgo.getTime();
  const randomTime = Math.random() * timeDiff;
  
  return new Date(threeMonthsAgo.getTime() + randomTime);
};

// Helper function to get random description for a category
const getRandomDescription = (category) => {
  const descriptions = expenseDescriptions[category];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Helper function to get random category
const getRandomCategory = () => {
  return expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
};

const seedExpenses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker');
    console.log('Connected to MongoDB');

    // Check if there are any users in the database
    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found. Please create a user first before seeding expenses.');
      process.exit(1);
    }

    // Clear existing expenses (optional - comment out if you want to keep existing data)
    await Expense.deleteMany({});
    console.log('Cleared existing expenses');

    const expenses = [];
    
    // Generate expenses for each user
    for (const user of users) {
      // Generate 60-100 expenses per user over 3 months
      const numExpenses = getRandomAmount(60, 100);
      
      for (let i = 0; i < numExpenses; i++) {
        const categoryData = getRandomCategory();
        const amount = getRandomAmount(categoryData.minAmount, categoryData.maxAmount);
        const description = getRandomDescription(categoryData.category);
        const date = getRandomDate();

        expenses.push({
          user: user._id,
          amount: amount,
          description: description,
          category: categoryData.category,
          date: date,
        });
      }
    }

    // Insert all expenses
    await Expense.insertMany(expenses);
    
    console.log(`Successfully seeded ${expenses.length} expenses for ${users.length} user(s)`);
    console.log('Expense categories generated:');
    
    // Show summary by category
    const summary = {};
    expenses.forEach(expense => {
      if (!summary[expense.category]) {
        summary[expense.category] = { count: 0, total: 0 };
      }
      summary[expense.category].count++;
      summary[expense.category].total += expense.amount;
    });

    Object.entries(summary).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.count} expenses, $${data.total.toFixed(2)} total`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding expenses:', error);
    process.exit(1);
  }
};

// Run the seeder
seedExpenses();
