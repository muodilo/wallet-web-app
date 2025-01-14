const express = require("express");
require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db.js");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");


connectDB();


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Routes
app.get("/", (req, res) => {
	res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
