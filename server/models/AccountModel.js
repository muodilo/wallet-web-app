const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true, // e.g., "Bank Account", "Mobile Money"
		},
		accountType: {
			type: String,
			enum: ["Bank", "Mobile Money", "Cash"],
			required: true,
		},
		balance: {
			type: Number,
			default: 0
		},
	},
	{
		timestamps: true,
	}
);

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
