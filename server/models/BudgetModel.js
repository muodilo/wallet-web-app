const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		limit: {
			type: Number,
			required: true,
		},
		currentSpending: {
			type: Number,
			default: 0,
		},
    notifyExceeded: {
      type: Boolean,
      default: false
    }, // Automatically set to true if the limit is exceeded
	},
	{
		timestamps: true,
	}
);

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
