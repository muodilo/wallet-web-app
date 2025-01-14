const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");


// Load environment variables
dotenv.config();


const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
