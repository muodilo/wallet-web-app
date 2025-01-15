const express = require("express");
const {
	createTransaction,
	getAllTransactions,
	editTransaction,
	deleteTransaction,
	getTransactionSummary,
	getBarChartData,
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * api/v1/transactions:
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
 * api/v1/transactions:
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


/**
 * @swagger
 * api/v1/transactions/{transactionId}:
 *   put:
 *     summary: Edit a transaction
 *     description: Update a specific transaction (income or expense) by its ID.
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transaction to be updated
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
 *                 example: "Updated salary for July"
 *     responses:
 *       200:
 *         description: Transaction updated successfully
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
 *                   example: "Updated salary for July"
 *                 createdAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields (account, category, amount, type) are required"
 *       404:
 *         description: Transaction or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Internal server error
 */
router.put("/:transactionId", protect, editTransaction);



/**
 * @swagger
 * api/v1/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Delete an existing transaction and update the account balance accordingly.
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction deleted successfully"
 *       404:
 *         description: Transaction or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Internal server error
 */
router.delete("/:transactionId", protect, deleteTransaction);

/**
 * @swagger
 * api/v1/transactions/summary:
 *   get:
 *     summary: Get summary of transactions for pie chart
 *     description: Calculates total Income and Expense amounts for the authenticated user, with an optional date range.
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date of the range (optional).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date of the range (optional).
 *     responses:
 *       200:
 *         description: Summary of transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Income"
 *                   totalAmount:
 *                     type: number
 *                     example: 1500
 *       400:
 *         description: Bad request if date range is invalid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to calculate transaction summary"
 */
router.get("/summary", protect, getTransactionSummary);

/**
 * @swagger
 * /transactions/bar-chart:
 *   get:
 *     summary: Get bar chart data for income and expense over a specified period (week, month, or year)
 *     description: This endpoint returns bar chart data grouped by income and expense for a given period. The period can be specified as 'week', 'month', or 'year'.
 *     tags:
 *       - Transactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: period
 *         in: query
 *         description: The period for which to get data. Options are 'week', 'month', or 'year'.
 *         required: true
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *           example: week
 *     responses:
 *       200:
 *         description: Successfully fetched bar chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "2024-01-01"
 *                   income:
 *                     type: number
 *                     example: 100
 *                   expense:
 *                     type: number
 *                     example: 50
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid period. Accepted values are 'week', 'month', 'year'."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching bar chart data"
 */
router.get("/bar-chart", protect, getBarChartData);


module.exports = router;
