const express = require("express");
const {
	createBudget,
	updateBudget,
	deleteBudget,
	getAllBudgets,
} = require("../controllers/budgetController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * api/v1/budgets:
 *   post:
 *     summary: Create a budget
 *     description: Create a new budget for a specific category with a spending limit.
 *     tags:
 *       - Budgets
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "64b12345678c9f0011223344"
 *               limit:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Budget created successfully
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
 *                   example: "64b12345678c9f0011223347"
 *                 category:
 *                   type: string
 *                   example: "64b12345678c9f0011223344"
 *                 limit:
 *                   type: number
 *                   example: 1000
 *                 currentSpending:
 *                   type: number
 *                   example: 0
 *                 notifyExceeded:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *       400:
 *         description: Invalid input or budget already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A budget for this category already exists"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal server error
 */
router.post("/", protect, createBudget);

/**
 * @swagger
 * api/v1/budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     description: Update an existing budget for the authenticated user.
 *     tags:
 *       - Budgets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64b12345678c9f0011223344"
 *         description: The ID of the budget to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "64b12345678c9f0011223345"
 *               limit:
 *                 type: number
 *                 example: 1000
 *               notifyExceeded:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64b12345678c9f0011223344"
 *                 user:
 *                   type: string
 *                   example: "64b12345678c9f0011223344"
 *                 category:
 *                   type: string
 *                   example: "64b12345678c9f0011223345"
 *                 limit:
 *                   type: number
 *                   example: 1000
 *                 currentSpending:
 *                   type: number
 *                   example: 500
 *                 notifyExceeded:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   example: "2024-01-10T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   example: "2024-01-15T15:00:00.000Z"
 *       404:
 *         description: Budget not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Budget not found"
 *       500:
 *         description: Internal server error
 */
router.put("/:id", protect, updateBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     description: Deletes a specific budget for the authenticated user.
 *     tags:
 *       - Budgets
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64b12345678c9f0011223344"
 *         description: The ID of the budget to delete.
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Budget deleted successfully"
 *       404:
 *         description: Budget not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Budget not found"
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", protect, deleteBudget);


/**
 * @swagger
 * api/v1/budgets:
 *   get:
 *     summary: Get all budgets
 *     description: Retrieve all budgets for the authenticated user.
 *     tags:
 *       - Budgets
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64b12345678c9f0011223344"
 *                   user:
 *                     type: string
 *                     example: "64b12345678c9f0011223345"
 *                   category:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64b12345678c9f0011223346"
 *                       name:
 *                         type: string
 *                         example: "Groceries"
 *                   limit:
 *                     type: number
 *                     example: 500
 *                   currentSpending:
 *                     type: number
 *                     example: 200
 *                   notifyExceeded:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     example: "2024-01-10T12:34:56.789Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-01-10T12:34:56.789Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching budgets"
 */
router.get("/", protect, getAllBudgets);


module.exports = router;
