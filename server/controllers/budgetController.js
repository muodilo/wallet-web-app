const asyncHandler = require("express-async-handler");
const Budget = require("../models/BudgetModel");
const Category = require("../models/CategoryModel");

// Create a new budget
const createBudget = asyncHandler(async (req, res) => {
	try {
		const { category, limit } = req.body;

		// Validate required fields
		if (!category || !limit) {
			res.status(400);
			throw new Error("Both category and limit are required");
		}

		// Validate that the limit is a positive number
		if (isNaN(limit) || limit <= 0) {
			res.status(400);
			throw new Error("Limit must be a positive number");
		}

		// Check if the category exists
		const categoryExists = await Category.findById(category);
		if (!categoryExists) {
			res.status(404);
			throw new Error("Category not found");
		}

		// Check if a budget already exists for this user and category
		const existingBudget = await Budget.findOne({
			user: req.user._id,
			category,
		});
		if (existingBudget) {
			res.status(400);
			throw new Error("A budget for this category already exists");
		}

		// Create the budget
		const budget = await Budget.create({
			user: req.user._id,
			category,
			limit,
			currentSpending: 0,
		});

		res.status(201).json(budget);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
});


// Update a budget
const updateBudget = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Budget ID from the URL
    const { category, limit, notifyExceeded } = req.body; // Fields to update

    // Find the budget by ID and ensure it belongs to the authenticated user
    const budget = await Budget.findOne({ _id: id, user: req.user._id });
    if (!budget) {
      res.status(404);
      throw new Error("Budget not found");
    }

    // Update fields if they are provided
    if (category) budget.category = category;
    if (limit) budget.limit = limit;
    if (notifyExceeded !== undefined) budget.notifyExceeded = notifyExceeded;

    // Save the updated budget
    const updatedBudget = await budget.save();

    res.status(200).json(updatedBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a budget
const deleteBudget = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Budget ID from the URL

    // Find the budget by ID and ensure it belongs to the authenticated user
    const budget = await Budget.findOne({ _id: id, user: req.user._id });
    if (!budget) {
      res.status(404);
      throw new Error("Budget not found");
    }

    // Delete the budget
    await budget.deleteOne();

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Get all budgets
const getAllBudgets = asyncHandler(async (req, res) => {
  try {
    // Find all budgets belonging to the authenticated user
    const budgets = await Budget.find({ user: req.user._id }).populate("category", "name");

    // Respond with the list of budgets
    res.status(200).json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



module.exports = { createBudget, deleteBudget, updateBudget, getAllBudgets };
