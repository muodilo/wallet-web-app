const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
	let token;

	// Check if authorization header exists and starts with "Bearer"
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Extract token from header
			token = req.headers.authorization.split(" ")[1];

			// Decode the token to get the user ID
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Find the user by ID from the token payload
			const user = await User.findById(decoded.id);
			if (!user) {
				res.status(401);
				throw new Error("Not authorized, user does not exist");
			}

			// Attach user to the request object
			req.user = user;
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	}

	// If no token is provided
	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token provided");
	}
});

module.exports = protect;
