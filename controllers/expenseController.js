import Expense from '../models/Expense.js';

const createExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user._id;
    
    const expense = new Expense({
        user: userId,
        amount,
        description,
        category,
    });
    
    const savedExpense = await expense.save();
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: savedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


const getAllExpenses = async (req, res) => {
  try {
    const { category, filter: dateFilter, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = { user: req.user._id };
    
    // Add category filter if provided
    if (category) {
      filter.category = category; 
    }
    
    // Add date filter
    const now = new Date();
    let dateFilterObj = {};
    
    switch (dateFilter) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateFilterObj = { $gte: weekAgo };
        break;
        
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateFilterObj = { $gte: monthAgo };
        break;
        
      case '3months':
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        dateFilterObj = { $gte: threeMonthsAgo };
        break;
        
      case 'custom':
        if (startDate || endDate) {
          if (startDate && endDate) {
            dateFilterObj = { 
              $gte: new Date(startDate), 
              $lte: new Date(endDate) 
            };
          } else if (startDate) {
            dateFilterObj = { $gte: new Date(startDate) };
          } else if (endDate) {
            dateFilterObj = { $lte: new Date(endDate) };
          }
        }
        break;
        
      default:
        // No date filter applied
        break;
    }
    
    // Add date filter to main filter if it exists
    if (Object.keys(dateFilterObj).length > 0) {
      filter.date = dateFilterObj;
    }
    
    const expenses = await Expense.find(filter).sort({ date: -1 });
    
    res.json({
      success: true,
      count: expenses.length,
      data: expenses,
      appliedFilters: {
        category: category || null,
        dateFilter: dateFilter || null,
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


const updateExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }
    

    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.category = category || expense.category;
    
    const updatedExpense = await expense.save();
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


const deleteExpense = async (req, res) => {
  try {
 
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }
    
    await Expense.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export { createExpense,getAllExpenses, updateExpense,deleteExpense,};
