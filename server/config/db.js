const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI);
		if (conn) {
			console.log(
				`Database is connected: ${conn.connection.host}`.cyan.underline
			);
		}
	} catch (error) {
		console.log(error.message.red.underline);
		process.exit(1);
	}
};

module.exports = connectDB;
