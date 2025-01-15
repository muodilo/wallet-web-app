const asyncHandler = require("express-async-handler");
const Transaction = require("../models/TransactionModel");
const Account = require("../models/AccountModel");

// Create a transaction
const createTransaction = asyncHandler(async (req, res) => {
	try {
		const { account, category, amount, type, description } = req.body;

		// Validate required fields
		if (!account || !category || !amount || !type) {
			res.status(400);
			throw new Error(
				"All fields (account, category, amount, type) are required"
			);
		}

		// Ensure type matches either "Income" or "Expense"
		if (!["Income", "Expense"].includes(type)) {
			res.status(400);
			throw new Error('Type must be either "Income" or "Expense"');
		}

		// Ensure amount is a number and handle any non-numeric inputs
		if (isNaN(amount) || amount <= 0) {
			res.status(400);
			throw new Error("Amount must be a valid positive number");
		}

		// Find the account to ensure it exists
		const accountExists = await Account.findById(account);
		if (!accountExists) {
			res.status(404);
			throw new Error("Account not found");
		}

		// Ensure balance is a number (log current balance for debugging)
		let currentBalance = Number(accountExists.balance);
		console.log("Current Balance:", currentBalance);

		if (isNaN(currentBalance)) {
			res.status(500);
			throw new Error("Account balance is invalid");
		}

		// If the transaction is an "Expense", check if the account has enough balance
		if (type === "Expense" && currentBalance < amount) {
			res.status(400);
			throw new Error("Insufficient balance for this expense");
		}

		// Ensure amount is a number before performing arithmetic
		const transactionAmount = Number(amount);
		console.log("Transaction Amount:", transactionAmount);

		if (isNaN(transactionAmount)) {
			res.status(400);
			throw new Error("Invalid transaction amount");
		}

		// Calculate the new account balance
		const updatedBalance =
			type === "Income"
				? currentBalance + transactionAmount
				: currentBalance - transactionAmount;

		// Log updated balance for debugging
		console.log("Updated Balance:", updatedBalance);

		// Update the account balance
		accountExists.balance = updatedBalance;
		await accountExists.save();

		// Create the transaction
		const transaction = await Transaction.create({
			user: req.user._id,
			account,
			category,
			amount: transactionAmount,
			type,
			description,
		});

		res.status(201).json(transaction);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
});

// Get all transactions
const getAllTransactions = asyncHandler(async (req, res) => {
  try {
    // Fetch all transactions
    const transactions = await Transaction.find().populate('account category');

    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
      res.status(404);
      throw new Error("No transactions found");
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = { createTransaction, getAllTransactions };
