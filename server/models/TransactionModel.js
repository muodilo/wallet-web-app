const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		account: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: ["Income", "Expense"],
			required: true,
		},
    description: {
      type: String
    },
	},
	{
		timestamps: true,
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
