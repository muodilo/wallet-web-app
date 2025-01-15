const express = require("express");
const {
	createAccount,
	editAccount,
	deleteAccount,
	getAllAccounts,
	getAccountById,
} = require("../controllers/accountController.js");
const protect = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @swagger
 *  /api/v1/accounts/create:
 *   post:
 *     summary: Create a new account
 *     description: Creates a new account for the authenticated user.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the account (e.g., "Savings Account").
 *                 example: "My Savings Account"
 *               accountType:
 *                 type: string
 *                 description: The type of account.
 *                 enum: [Bank, Mobile Money, Cash]
 *                 example: "Bank"
 *               balance:
 *                 type: number
 *                 description: The initial balance of the account.
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Account successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created account.
 *                 user:
 *                   type: string
 *                   description: The ID of the authenticated user.
 *                 name:
 *                   type: string
 *                   description: The name of the account.
 *                 accountType:
 *                   type: string
 *                   description: The type of account.
 *                 balance:
 *                   type: number
 *                   description: The balance of the account.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the account was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the account was last updated.
 *       400:
 *         description: Bad request. Missing or invalid fields.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 */
router.post("/create", protect, createAccount);

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API endpoints for managing user accounts
 */

/**
 * @swagger
 *  /api/v1/accounts/{id}:
 *   put:
 *     summary: Edit an account
 *     description: Allows the authenticated user to edit their account details.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the account
 *                 example: "Updated Account Name"
 *               accountType:
 *                 type: string
 *                 description: The updated type of the account
 *                 enum: [Bank, Mobile Money, Cash]
 *                 example: "Cash"
 *               balance:
 *                 type: number
 *                 description: The updated balance of the account
 *                 example: 500
 *     responses:
 *       200:
 *         description: Account successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 name:
 *                   type: string
 *                 accountType:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request. Missing or invalid fields.
 *       403:
 *         description: Forbidden. User not authorized to edit this account.
 *       404:
 *         description: Account not found.
 *       401:
 *         description: Unauthorized. No token provided or invalid token.
 */
router.put("/:id", protect, editAccount);


/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API endpoints for managing user accounts
 */

/**
 * @swagger
 *  /api/v1/accounts/{id}:
 *   delete:
 *     summary: Delete an account
 *     description: Allows the authenticated user to delete their account.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to delete
 *     responses:
 *       200:
 *         description: Account successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Unauthorized. No token provided or invalid token.
 *       403:
 *         description: Forbidden. User not authorized to delete this account.
 *       404:
 *         description: Account not found.
 */
router.delete("/:id", protect, deleteAccount);


/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API endpoints for managing user accounts
 */

/**
 * @swagger
 *  /api/v1/accounts:
 *   get:
 *     summary: Get all accounts
 *     description: Fetch all accounts associated with the authenticated user.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60b8c5f7a0c32c3f8cd5b9c2"
 *                   name:
 *                     type: string
 *                     example: "Bank Account"
 *                   accountType:
 *                     type: string
 *                     example: "Bank"
 *                   balance:
 *                     type: number
 *                     example: 1000
 *       401:
 *         description: Unauthorized. No token provided or invalid token.
 *       404:
 *         description: No accounts found for the user.
 */
router.get("/", protect, getAllAccounts);


/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API endpoints for managing user accounts
 */

/**
 * @swagger
 * /api/v1/accounts/{accountId}:
 *   get:
 *     summary: Get a single account by ID
 *     description: Fetch a specific account based on its ID for the authenticated user.
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         description: The ID of the account to fetch
 *         schema:
 *           type: string
 *           example: "60b8c5f7a0c32c3f8cd5b9c2"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A single account's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60b8c5f7a0c32c3f8cd5b9c2"
 *                 name:
 *                   type: string
 *                   example: "Bank Account"
 *                 accountType:
 *                   type: string
 *                   example: "Bank"
 *                 balance:
 *                   type: number
 *                   example: 1000
 *       401:
 *         description: Unauthorized. No token provided or invalid token.
 *       404:
 *         description: Account not found or not authorized.
 */
router.get("/:accountId", protect, getAccountById);

module.exports = router;
