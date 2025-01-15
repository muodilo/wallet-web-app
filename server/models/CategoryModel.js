const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			default: null,
		}, // Null for top-level categories
    type: {
      type: String,
      enum: ["Income", "Expense"],
      required: true
    }, // Type of category
	},
	{
		timestamps: true,
	}
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
