const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const createUser = asyncHandler(async (req, res) => {
	const { firstname, lastname, email, password, role, imageUrl } =
		req.body; // Include imageUrl

	// Check for all required fields
	if (!firstname || !lastname || !email  || !password) {
		res.status(400);
		throw new Error("Please provide all required fields");
	}

	try {
		// Check if the user already exists by email or phone
		const existingUser = await User.findOne({ $or: [{ email }] });
		if (existingUser) {
			res.status(403);
			throw new Error("User with this email or phone number already exists");
		}

		// Hash the password before saving
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user with provided fields
		const user = await User.create({
			firstname,
			lastname,
			email,
			password: hashedPassword,
			role: role || "user", 
			imageUrl: imageUrl || null,
		});

		res.status(201).json({
			id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			role: user.role,
			imageUrl: user.imageUrl, // Include imageUrl in the response
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

// Token generation function
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};

module.exports = { createUser };