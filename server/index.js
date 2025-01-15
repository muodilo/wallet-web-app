const express = require("express");
require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db.js");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const swaggerDocs = require("./config/swagger.js");
const { errorHandler } = require("./middleware/errorHandlerMiddleware.js");


connectDB();


const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Routes
app.use("/api/v1/users", require("./routes/userRoute.js"));
app.use("/api/v1/accounts", require("./routes/accountRoute.js"));
app.use("/api/v1/categories", require("./routes/categoryRoute.js"));
app.use("/api/v1/transactions", require("./routes/transactionRoute.js"));
app.use("/api/v1/budgets", require("./routes/budgetRoute.js"));


app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
