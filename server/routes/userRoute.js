const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controllers/userController.js");

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Create a new user
 *     description: Only accessible by admins. Creates a new user, typically an employee, with the provided details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: First name of the user
 *               lastname:
 *                 type: string
 *                 description: Last name of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user, must be unique
 *               password:
 *                 type: string
 *                 description: User's password (will be hashed before storing)
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: Role of the user (admin can assign either role; defaults to user)
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 description: Optional URL of the user's image. Defaults to null if not provided.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created user
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                   nullable: true
 *                   description: URL of the user's image
 *                 token:
 *                   type: string
 *                   description: Authentication token for the created user
 *       400:
 *         description: Bad request (e.g., missing required fields or user already exists)

 */
router.post("/register", createUser);


/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user using their email and password, returning a JSON Web Token (JWT) if successful.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "yourpassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the user
 *                 firstname:
 *                   type: string
 *                   description: User's first name
 *                 lastname:
 *                   type: string
 *                   description: User's last name
 *                 email:
 *                   type: string
 *                   description: User's email number
 *                 role:
 *                   type: string
 *                   description: User's role (e.g., employee or admin)
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       401:
 *         description: Unauthorized - Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Server error
 */
router.post("/login", loginUser);




module.exports = router;