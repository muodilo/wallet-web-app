const asyncHandler = require("express-async-handler");
const Transaction = require("../models/TransactionModel");
const Account = require("../models/AccountModel");
const Budget = require("../models/BudgetModel");
const moment = require("moment");



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

		// Ensure amount is a valid positive number
		const transactionAmount = Number(amount);
		if (isNaN(transactionAmount) || transactionAmount <= 0) {
			res.status(400);
			throw new Error("Amount must be a valid positive number");
		}

		// Check if the account exists
		const accountExists = await Account.findById(account);
		if (!accountExists) {
			res.status(404);
			throw new Error("Account not found");
		}

		// Ensure sufficient balance for "Expense" transactions
		if (type === "Expense" && accountExists.balance < transactionAmount) {
			res.status(400);
			throw new Error("Insufficient balance for this expense");
		}

		// Update account balance
		accountExists.balance =
			type === "Income"
				? accountExists.balance + transactionAmount
				: accountExists.balance - transactionAmount;
		await accountExists.save();

		// Check if a budget exists for the category
		const budget = await Budget.findOne({ user: req.user._id, category });
		if (budget) {
			// Update currentSpending for the budget
			budget.currentSpending += type === "Expense" ? transactionAmount : 0;

			// Check if the spending exceeds the budget limit and set notifyExceeded
			if (budget.currentSpending > budget.limit) {
				budget.notifyExceeded = true;
			}

			await budget.save();
		}

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


const getAllTransactions = asyncHandler(async (req, res) => {
	try {
		// Fetch transactions for the authenticated user
		const transactions = await Transaction.find({
			user: req.user._id,
		}).populate("account category"); // Assuming `account` and `category` are references

		// If no transactions are found, return an empty array
		if (!transactions || transactions.length === 0) {
			return res.status(200).json([]); // Return an empty array with status 200
		}

		res.status(200).json(transactions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
});








// Edit a transaction
const editTransaction = asyncHandler(async (req, res) => {
  try {
    const { transactionId } = req.params; // Get the transaction ID from URL params
    const { account, category, amount, type, description } = req.body; // Get the fields to update

    // Find the transaction to update
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    // Ensure the account exists if being updated
    let accountExists;
    if (account) {
      accountExists = await Account.findById(account);
      if (!accountExists) {
        res.status(404);
        throw new Error("Account not found");
      }
    }

    // Handle updating the account balance for expense type
    if (account && account !== transaction.account.toString()) {
      const oldAccount = await Account.findById(transaction.account);
      oldAccount.balance += transaction.amount; // Revert balance for old account
      await oldAccount.save();

      if (type === "Expense" && accountExists.balance < amount) {
        res.status(400);
        throw new Error("Insufficient balance for this expense");
      }

      // Deduct the amount from the new account for Expense type
      accountExists.balance -= amount;
      await accountExists.save();
    }

    // Update fields in the transaction object only if they are provided
    if (category) transaction.category = category;
    if (amount !== undefined) transaction.amount = amount; // Ensure amount is updated
    if (type) transaction.type = type;
    if (description) transaction.description = description;
    if (account) transaction.account = account;

    // Save the updated transaction
    await transaction.save();

    // Return the updated transaction
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Delete a transaction
const deleteTransaction = asyncHandler(async (req, res) => {
	try {
		const { transactionId } = req.params; // Get the transaction ID from URL params

		// Find the transaction to delete
		const transaction = await Transaction.findById(transactionId);
		if (!transaction) {
			res.status(404);
			throw new Error("Transaction not found");
		}

		// Find the account associated with the transaction
		const account = await Account.findById(transaction.account);
		if (!account) {
			res.status(404);
			throw new Error("Account not found");
		}

		// If the transaction is an "Income", we subtract the amount from the account balance
		if (transaction.type === "Income") {
			account.balance -= transaction.amount;
		} else if (transaction.type === "Expense") {
			// If the transaction is an "Expense", we add the amount back to the account balance
			account.balance += transaction.amount;
		}

		// Save the updated account balance
		await account.save();

		// Delete the transaction
		await transaction.deleteOne();

		// Return success response
		res.status(200).json({ message: "Transaction deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
});


// Get transaction summary for pie chart with optional date range
const getTransactionSummary = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build match filter
    const matchFilter = { user: req.user._id }; // Filter by authenticated user

    // If date range is provided, add date filtering to match
    if (startDate && endDate) {
      matchFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Aggregate transactions to calculate total Income and Expense
    const summary = await Transaction.aggregate([
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: "$type", // Group by type (Income/Expense)
          totalAmount: { $sum: "$amount" }, // Calculate total amount
        },
      },
    ]);

    // Format the result into a pie chart-friendly format
    const formattedSummary = summary.map((item) => ({
      type: item._id, // Either "Income" or "Expense"
      totalAmount: item.totalAmount,
    }));

    res.status(200).json(formattedSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate transaction summary" });
  }
});


// Helper function to get the start and end of a week, month, or year
const getDateRange = (period, date) => {
  let startDate, endDate;
  if (period === "week") {
    // Week starts on Monday and ends on Sunday
    startDate = moment(date).startOf('week').add(1, 'days'); // Start on Monday
    endDate = moment(date).endOf('week'); // End on Sunday
  } else if (period === "month") {
    // Start of the month to the end of the month
    startDate = moment(date).startOf('month');
    endDate = moment(date).endOf('month');
  } else if (period === "year") {
    // Start of the year to the end of the year
    startDate = moment(date).startOf('year');
    endDate = moment(date).endOf('year');
  }
  return { startDate, endDate };
};

// Get bar chart data for income and expense grouped by week, month, or year
const getBarChartData = asyncHandler(async (req, res) => {
  try {
		const { period } = req.query;

		// Validate period input
		if (!["week", "month", "year"].includes(period)) {
			res.status(400);
			throw new Error(
				'Invalid period. Allowed values: "week", "month", "year"'
			);
		}

		const currentDate = moment(); // Current date
		const { startDate, endDate } = getDateRange(period, currentDate);

		// Initialize the result object depending on the period
		let barChartData = [];

		if (period === "week") {
			// Generate data for each day of the week (Monday to Sunday)
			const weekDays = [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			];
			weekDays.forEach((day) => {
				barChartData.push({ [day]: { income: 0, expense: 0 } });
			});
		} else if (period === "month") {
			// Generate data for each day of the month (1st to last day)
			const daysInMonth = moment(startDate).daysInMonth();
			for (let day = 1; day <= daysInMonth; day++) {
				barChartData.push({ [`Day ${day}`]: { income: 0, expense: 0 } });
			}
		} else if (period === "year") {
			// Generate data for each month of the year (January to December)
			const months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			months.forEach((month) => {
				barChartData.push({ [month]: { income: 0, expense: 0 } });
			});
		}

		// Aggregate transactions to calculate total Income and Expense per day or month or year
		const transactions = await Transaction.aggregate([
			{
				$match: {
					user: req.user._id,
					createdAt: {
						$gte: startDate.toDate(), // Filter transactions by the calculated start date
						$lte: endDate.toDate(), // Filter transactions by the calculated end date
					},
				},
			},
			{
				$group: {
					_id: {
						period:
							period === "week"
								? { $dayOfWeek: "$createdAt" }
								: period === "month"
								? { $dayOfMonth: "$createdAt" }
								: { $month: "$createdAt" },
						type: "$type",
					},
					totalAmount: { $sum: "$amount" },
				},
			},
			{
				$group: {
					_id: "$_id.period", // Group by period (week, day, month)
					income: {
						$sum: {
							$cond: [{ $eq: ["$_id.type", "Income"] }, "$totalAmount", 0],
						},
					},
					expense: {
						$sum: {
							$cond: [{ $eq: ["$_id.type", "Expense"] }, "$totalAmount", 0],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					period: "$_id",
					income: { $ifNull: ["$income", 0] }, // If no data, set to 0
					expense: { $ifNull: ["$expense", 0] }, // If no data, set to 0
				},
			},
		]);

		// Now fill the barChartData with the transaction data
		transactions.forEach((transaction) => {
			const periodIndex = transaction.period; // This will be the day of the week, day of the month, or month of the year
			const income = transaction.income;
			const expense = transaction.expense;

			if (period === "week") {
				// Get the name of the day (Monday, Tuesday, etc.)
				const weekDays = [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday",
				];
				barChartData[periodIndex - 1][weekDays[periodIndex - 1]] = {
					income,
					expense,
				};
			} else if (period === "month") {
				// Set the income and expense for the corresponding day of the month
				barChartData[periodIndex - 1][`Day ${periodIndex}`] = {
					income,
					expense,
				};
			} else if (period === "year") {
				// Set the income and expense for the corresponding month
				const months = [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
				];
				barChartData[periodIndex - 1][months[periodIndex - 1]] = {
					income,
					expense,
				};
			}
		});

		res.status(200).json(barChartData);
	} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bar chart data" });
  }
});



module.exports = {
	createTransaction,
	getAllTransactions,
	editTransaction,
	deleteTransaction,
	getTransactionSummary,
	getBarChartData,
};
