import express from 'express';
import  {authMiddleware}  from '../middleware/auth.js';
import { createExpense, deleteExpense, updateExpense, getAllExpenses } from '../controllers/expenseController.js';
const router = express.Router();

router.post('/', authMiddleware, createExpense);
router.get('/', authMiddleware, getAllExpenses);
router.patch('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

export default router