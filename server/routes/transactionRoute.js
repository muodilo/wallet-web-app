const express = require("express");
const {
	createTransaction,
	getAllTransactions,
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     description: Record a new transaction (income or expense) for the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account:
 *                 type: string
 *                 example: "64b12345678c9f0011223344"
 *               category:
 *                 type: string
 *                 example: "64b12345678c9f0011223345"
 *               amount:
 *                 type: number
 *                 example: 500
 *               type:
 *                 type: string
 *                 enum: [Income, Expense]
 *                 example: "Income"
 *               description:
 *                 type: string
 *                 example: "Salary for June"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64b12345678c9f0011223346"
 *                 user:
 *                   type: string
 *                   example: "64b12345678c9f0011223344"
 *                 account:
 *                   type: string
 *                   example: "64b12345678c9f0011223344"
 *                 category:
 *                   type: string
 *                   example: "64b12345678c9f0011223345"
 *                 amount:
 *                   type: number
 *                   example: 500
 *                 type:
 *                   type: string
 *                   enum: [Income, Expense]
 *                   example: "Income"
 *                 description:
 *                   type: string
 *                   example: "Salary for June"
 *                 createdAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *       400:
 *         description: Invalid input or insufficient balance for expense
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient balance for this expense"
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error
 */
router.post("/", protect, createTransaction);



/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Fetch all transactions for the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64b12345678c9f0011223346"
 *                   user:
 *                     type: string
 *                     example: "64b12345678c9f0011223344"
 *                   account:
 *                     type: string
 *                     example: "64b12345678c9f0011223344"
 *                   category:
 *                     type: string
 *                     example: "64b12345678c9f0011223345"
 *                   amount:
 *                     type: number
 *                     example: 500
 *                   type:
 *                     type: string
 *                     enum: [Income, Expense]
 *                     example: "Income"
 *                   description:
 *                     type: string
 *                     example: "Salary for June"
 *                   createdAt:
 *                     type: string
 *                     example: "2024-01-10T12:34:56.789Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-01-10T12:34:56.789Z"
 *       404:
 *         description: No transactions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No transactions found"
 *       500:
 *         description: Internal server error
 */
router.get("/", protect, getAllTransactions);

module.exports = router;
