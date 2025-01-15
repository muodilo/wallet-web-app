const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
	const { name, parent, type } = req.body;

	// Ensure all required fields are provided
	if (!name || !type) {
		res.status(400);
		throw new Error("Please provide all required fields");
	}

	// Check if type is valid
	const validCategoryTypes = ["Expense", "Income"];
	if (!validCategoryTypes.includes(type)) {
		res.status(400);
		throw new Error("Invalid category type");
	}

	// Create a new category
	const category = await Category.create({
		name,
		parent: parent || null, // Default to null for top-level categories
		type,
		user: req.user._id, // Associate the category with the authenticated user
	});

	res.status(201).json(category);
});


const getCategoryFamily = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;

	try {
		// Find the category by ID
		const category = await Category.findById(categoryId);
		if (!category) {
			res.status(404);
			throw new Error("Category not found");
		}

		console.log("Category:", category);

		// Find the parent category if the category has a parent
		const parentCategory = category.parent
			? await Category.findById(category.parent.toString()) // Use string ID
			: null;

		console.log("Parent Category:", parentCategory);

		// Find all child categories
		const childCategories = await Category.find({ parent: categoryId });

		console.log("Child Categories:", childCategories);

		res.status(200).json({
			category,
			parent: parentCategory,
			children: childCategories,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
});


// Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, parent, type } = req.body;

    try {
        // Find the category by ID
        const category = await Category.findById(categoryId);

        if (!category) {
            res.status(404);
            throw new Error("Category not found");
        }

        // Update the fields if provided
        if (name) category.name = name;
        if (parent !== undefined) category.parent = parent; // Allow setting parent to null
        if (type) category.type = type;

        // Save the updated category
        const updatedCategory = await category.save();

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Find the category by ID
        const category = await Category.findById(categoryId);

        if (!category) {
            res.status(404);
            throw new Error("Category not found");
        }

        // Delete the category
        await category.deleteOne();

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        // Fetch all categories belonging to the authenticated user
        const categories = await Category.find({ user: req.user._id });

        if (!categories.length) {
            res.status(404);
            throw new Error("No categories found");
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = {
	createCategory,
	getCategoryFamily,
	updateCategory,
	deleteCategory,
	getAllCategories,
};
