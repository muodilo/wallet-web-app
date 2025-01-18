import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const CreateTransactionModal = ({ isOpen, onClose }) => {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [subCategories, setSubCategories] = useState([]);
	const [accounts, setAccounts] = useState([]); // Add state for accounts
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [childCategoryName, setChildCategoryName] = useState("");
	const [childCategoryType, setChildCategoryType] = useState("Income");

	const [formData, setFormData] = useState({
		account: "",
		category: "",
		amount: "",
		type: "Income", // Default type
		description: "",
	});

	// Fetch accounts
	useEffect(() => {
		const fetchAccounts = async () => {
			try {
				const response = await fetch(`${API_URL}/accounts`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await response.json();

				if (response.ok) {
					setAccounts(data); // Update the accounts state with fetched data
        } else {
          if (user) {
            
            toast.error("Failed to fetch accounts.");
          }
				}
			} catch (error) {
				console.error(error);
				toast.error("An error occurred while fetching accounts.");
			}
		};

		fetchAccounts();
	}, [API_URL, token]);

	// Fetch top-level categories (parent === null)
	useEffect(() => {
		const fetchTopLevelCategories = async () => {
			try {
				const response = await fetch(`${API_URL}/categories`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await response.json();

				if (response.ok) {
					const topLevelCategories = data.filter((cat) => cat.parent === null);
					setCategories(topLevelCategories);
        } else {
          if (user) {
            toast.error("Failed to fetch categories.");
            
          }
				}
			} catch (error) {
				console.error(error);
				toast.error("An error occurred while fetching categories.");
			}
		};

		fetchTopLevelCategories();
	}, [API_URL, token]);

	// Fetch category family (children and parent) only when category is clicked
	const fetchCategoryFamily = async (categoryId) => {
		try {
			const response = await fetch(
				`${API_URL}/categories/family/${categoryId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await response.json();

			if (response.ok) {
				return data.children || [];
			} else {
				toast.error("Failed to fetch subcategories.");
				return [];
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while fetching subcategories.");
			return [];
		}
	};

	// Handle category selection and display children if available
	const handleCategoryClick = async (category) => {
		if (selectedCategory?._id !== category._id) {
			setSelectedCategory(category);
			setFormData((prev) => ({ ...prev, category: category._id }));

			// Fetch subcategories only once when a category is clicked
			const children = await fetchCategoryFamily(category._id);
			if (children.length > 0) {
				setSubCategories(children); // Set children for the selected category
			} else {
				setSubCategories([]); // No children, so reset subcategories
			}
		} else {
			// If the same category is clicked again, clear the subcategories
			setSelectedCategory(null);
			setSubCategories([]);
		}
	};

	// Handle adding a new subcategory
	const handleAddSubcategory = async () => {
		if (!childCategoryName) {
			toast.error("Please provide a name for the subcategory.");
			return;
		}

		try {
			const response = await fetch(`${API_URL}/categories`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: childCategoryName,
					type: childCategoryType,
					parent: selectedCategory._id,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Subcategory added successfully.");
				setSubCategories((prev) => [...prev, data]); // Update subcategories
				setChildCategoryName(""); // Clear input field
			} else {
				toast.error("Failed to add subcategory.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while adding subcategory.");
		}
	};

	// Handle deleting a subcategory
	const handleDeleteSubcategory = async (subcategoryId) => {
		try {
			const response = await fetch(`${API_URL}/categories/${subcategoryId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.ok) {
				toast.success("Subcategory deleted successfully.");
				setSubCategories((prev) =>
					prev.filter((child) => child._id !== subcategoryId)
				); // Remove deleted subcategory
			} else {
				toast.error("Failed to delete subcategory.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while deleting subcategory.");
		}
	};

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const payload = {
			account: formData.account,
			category: formData.category,
			amount: Number(formData.amount),
			type: formData.type,
			description: formData.description,
		};

		try {
			const response = await fetch(`${API_URL}/transactions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (response.ok) {
				toast.success("Transaction created successfully!");
				onClose(); // Close modal
			} else {
				toast.error(result.error || "Failed to create transaction.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred during submission.");
		}

		setIsSubmitting(false);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 py-5  bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white max-h-screen overflow-auto p-6 rounded-lg shadow-lg w-full max-w-md'>
				<h2 className='text-xl font-semibold mb-4'>Create Transaction</h2>

				<form onSubmit={handleSubmit}>
					{/* Account Selection */}
					<div className='mb-4'>
						<label htmlFor='account' className='block text-sm font-medium mb-1'>
							Select Account
						</label>
						<select
							id='account'
							name='account'
							value={formData.account}
							onChange={handleChange}
							className='w-full p-2 border rounded'
							required>
							<option value=''>Select Account</option>
							{accounts.map((account) => (
								<option key={account._id} value={account._id}>
									{account.name}
								</option>
							))}
						</select>
					</div>

					{/* Category Selection */}
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-1'>
							{categories.length > 0
								? "Select Category"
								: "No Categories Available"}
						</label>
						<div>
							{categories.map((category) => (
								<div key={category._id}>
									<div
										className='cursor-pointer flex items-center mb-2'
										onClick={() => handleCategoryClick(category)}>
										<input
											type='radio'
											id={category._id}
											name='category'
											value={category._id}
											checked={formData.category === category._id}
											onChange={() => handleCategoryClick(category)}
											className='mr-2'
										/>
										<label htmlFor={category._id}>{category.name}</label>
									</div>
									{/* Show subcategories if any */}
									{category._id === selectedCategory?._id &&
										subCategories.length > 0 && (
											<div className='ml-4'>
												<h4 className='text-sm font-medium mb-2'>
													Choose among subcategories of {category.name}
												</h4>
												{subCategories.map((child) => (
													<div
														key={child._id}
														className='flex justify-between mb-2'>
														<div>
															<input
																type='radio'
																id={child._id}
																name='category'
																value={child._id}
																onChange={() =>
																	setFormData((prev) => ({
																		...prev,
																		category: child._id,
																	}))
																}
																checked={formData.category === child._id}
															/>
															<label htmlFor={child._id}>{child.name}</label>
														</div>
														<button
															type='button'
															onClick={() => handleDeleteSubcategory(child._id)}
															className='text-red-600 text-xs'>
															Delete
														</button>
													</div>
												))}
											</div>
										)}
								</div>
							))}
						</div>
					</div>

					{/* New Subcategory */}
					{selectedCategory && (
						<div className='mb-4'>
							<h3 className='font-medium mb-2'>
								Create New Subcategory of {selectedCategory?.name}
							</h3>
							<input
								type='text'
								className='w-full p-2 border rounded mb-2'
								placeholder='Enter Subcategory Name'
								value={childCategoryName}
								onChange={(e) => setChildCategoryName(e.target.value)}
							/>
							<select
								className='w-full p-2 border rounded mb-2'
								value={childCategoryType}
								onChange={(e) => setChildCategoryType(e.target.value)}>
								<option value='Income'>Income</option>
								<option value='Expense'>Expense</option>
							</select>
							<button
								type='button'
								onClick={handleAddSubcategory}
								className='bg-primaryColor text-white py-2 px-4 rounded'>
								Add Subcategory
							</button>
						</div>
					)}

					{/* Transaction Type */}
					<div className='mb-4'>
						<label htmlFor='type' className='block text-sm font-medium mb-1'>
							Transaction Type
						</label>
						<select
							id='type'
							name='type'
							value={formData.type}
							onChange={handleChange}
							className='w-full p-2 border rounded'
							required>
							<option value='Income'>Income</option>
							<option value='Expense'>Expense</option>
						</select>
					</div>

					{/* Amount */}
					<div className='mb-4'>
						<label htmlFor='amount' className='block text-sm font-medium mb-1'>
							Amount
						</label>
						<input
							id='amount'
							name='amount'
							type='number'
							value={formData.amount}
							onChange={handleChange}
							className='w-full p-2 border rounded'
							required
						/>
					</div>

					{/* Description */}
					<div className='mb-4'>
						<label
							htmlFor='description'
							className='block text-sm font-medium mb-1'>
							Description
						</label>
						<input
							id='description'
							name='description'
							type='text'
							value={formData.description}
							onChange={handleChange}
							className='w-full p-2 border rounded'
						/>
					</div>

					<div className='flex justify-between'>
						<button
							type='button'
							onClick={onClose}
							className='bg-red-500 text-white py-2 px-4 rounded'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isSubmitting}
							className='bg-blue-500 text-white py-2 px-4 rounded'>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

CreateTransactionModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default CreateTransactionModal;
