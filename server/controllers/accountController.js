const asyncHandler = require("express-async-handler");
const Account =require("../models/AccountModel.js");

// Controller to create an account
const createAccount = asyncHandler(async (req, res) => {
	const { name, accountType, balance } = req.body;

	// Ensure the user is authenticated
	if (!req.user) {
		res.status(401);
		throw new Error("Not authorized");
	}

	// Validate required fields
	if (!name || !accountType) {
		res.status(400);
		throw new Error("Please provide all required fields: name and accountType");
	}

	// Check if accountType is valid
	const validAccountTypes = ["Bank", "Mobile Money", "Cash"];
	if (!validAccountTypes.includes(accountType)) {
		res.status(400);
		throw new Error("Invalid account type");
	}

	// Create the account
	try {
		const account = await Account.create({
			user: req.user._id, // Associate account with the authenticated user
			name,
			accountType,
			balance: balance || 0, // Default balance to 0 if not provided
		});

		// Respond with the newly created account
		res.status(201).json({
			id: account._id,
			user: account.user,
			name: account.name,
			accountType: account.accountType,
			balance: account.balance,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		});
	} catch (error) {
		res.status(500);
		throw new Error("Error creating account: " + error.message);
	}
});


// @desc    Edit an account
// @route   PUT /accounts/:id
// @access  Private
const editAccount = asyncHandler(async (req, res) => {
  const { id } = req.params; // Account ID from the URL
  const { name, accountType, balance } = req.body; // Fields to update

  // Ensure required fields are provided
  if (!name && !accountType && balance === undefined) {
    res.status(400);
    throw new Error("Please provide at least one field to update");
  }

  // Find the account by ID and ensure it belongs to the authenticated user
  const account = await Account.findById(id);

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  if (account.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You are not authorized to edit this account");
  }

  // Update the account fields
  if (name) account.name = name;
  if (accountType) {
    const validTypes = ["Bank", "Mobile Money", "Cash"];
    if (!validTypes.includes(accountType)) {
      res.status(400);
      throw new Error("Invalid account type");
    }
    account.accountType = accountType;
  }
  if (balance !== undefined) account.balance = balance;

  // Save the updated account
  const updatedAccount = await account.save();

  res.status(200).json({
    id: updatedAccount._id,
    user: updatedAccount.user,
    name: updatedAccount.name,
    accountType: updatedAccount.accountType,
    balance: updatedAccount.balance,
    createdAt: updatedAccount.createdAt,
    updatedAt: updatedAccount.updatedAt,
  });
});


// Delete Account
const deleteAccount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the account by ID
    const account = await Account.findById(id);

    // If account doesn't exist, return 404
    if (!account) {
        res.status(404);
        throw new Error("Account not found");
    }

    // Check if the logged-in user is the owner of the account
    if (account.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to delete this account");
    }

    // Delete the account
    await account.deleteOne();

    // Return a success message
    res.status(200).json({ message: "Account deleted successfully" });
});

// Get all accounts of the authenticated user
const getAllAccounts = asyncHandler(async (req, res) => {
    // Find all accounts belonging to the authenticated user
    const accounts = await Account.find({ user: req.user._id });

    // If no accounts are found, return an empty array
    if (!accounts || accounts.length === 0) {
        return res.status(404).json({ message: "No accounts found" });
    }

    // Return the list of accounts
    res.status(200).json(accounts);
});

// Get a single account by ID for the authenticated user
const getAccountById = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    // Find the account by its ID and ensure it's the user's account
    const account = await Account.findOne({ _id: accountId, user: req.user._id });

    if (!account) {
        return res.status(404).json({ message: "Account not found or not authorized" });
    }

    // Return the account details
    res.status(200).json(account);
});

module.exports = {
	createAccount,
	editAccount,
	deleteAccount,
	getAllAccounts,
	getAccountById,
};
