const express = require("express");
const {
	createCategory,
	getCategoryFamily,
	updateCategory,
	deleteCategory,
	getAllCategories,
} = require("../controllers/categoryController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a category, either as a top-level category or a subcategory.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Groceries"
 *               parent:
 *                 type: string
 *                 example: "60b8c5f7a0c32c3f8cd5b9c2"  # Optional, for subcategories
 *               type:
 *                 type: string
 *                 enum: ["Income", "Expense"]
 *                 example: "Expense"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   example: "Groceries"
 *                 parent:
 *                   type: string
 *                   example: "60b8c5f7a0c32c3f8cd5b9c2"  # If applicable
 *                 type:
 *                   type: string
 *                   example: "Expense"
 *       400:
 *         description: Bad Request. Missing required fields.
 *       401:
 *         description: Unauthorized. No token provided or invalid token.
 */
router.post("/", protect, createCategory);


/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * api/v1/categories/family/{categoryId}:
 *   get:
 *     summary: Get a category along with its parent and child categories
 *     description: Retrieve a category by ID and return the category object, its parent (if exists), and a list of its children (if any).
 *     tags: [Categories]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The unique identifier of the category
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the category family
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   description: The requested category object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the category
 *                     name:
 *                       type: string
 *                       description: The name of the category
 *                     parent:
 *                       type: string
 *                       nullable: true
 *                       description: The ID of the parent category, or null if no parent
 *                     type:
 *                       type: string
 *                       description: The category type (e.g., Expense or Income)
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the category was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the category was last updated
 *                 parent:
 *                   type: object
 *                   nullable: true
 *                   description: The parent category object, or null if no parent
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the parent category
 *                     name:
 *                       type: string
 *                       description: The name of the parent category
 *                     type:
 *                       type: string
 *                       description: The category type
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the parent category was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the parent category was last updated
 *                 children:
 *                   type: array
 *                   description: List of child category objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the child category
 *                       name:
 *                         type: string
 *                         description: The name of the child category
 *                       type:
 *                         type: string
 *                         description: The category type
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the child category was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the child category was last updated
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       401:
 *         description: Unauthorized. No token provided or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 */
router.get("/family/:categoryId", protect, getCategoryFamily);


/**
 * @swagger
 * api/v1/categories/{categoryId}:
 *   put:
 *     summary: Update an existing category
 *     description: Updates the details of a specific category. The user must be authenticated.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category
 *               parent:
 *                 type: string
 *                 nullable: true
 *                 description: The parent category ID, or null for a top-level category
 *               type:
 *                 type: string
 *                 enum: ["Income", "Expense"]
 *                 description: The type of the category
 *     responses:
 *       200:
 *         description: The updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal server error
 */
router.put("/:categoryId", protect, updateCategory);


/**
 * @swagger
 * api/v1/categories/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a specific category by its ID. The user must be authenticated.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:categoryId", protect, deleteCategory);

/**
 * @swagger
 * api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all categories associated with the authenticated user.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
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
 *                   name:
 *                     type: string
 *                     example: "Food"
 *                   parent:
 *                     type: string
 *                     example: null
 *                   type:
 *                     type: string
 *                     enum: [Income, Expense]
 *                     example: "Expense"
 *                   user:
 *                     type: string
 *                     example: "64b12345678c9f0011223344"
 *                   createdAt:
 *                     type: string
 *                     example: "2024-01-10T12:34:56.789Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-01-10T12:34:56.789Z"
 *       404:
 *         description: No categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No categories found
 *       500:
 *         description: Internal server error
 */
router.get("/", protect, getAllCategories);


module.exports = router;
