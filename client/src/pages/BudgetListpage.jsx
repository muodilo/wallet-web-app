import { useState, useEffect } from "react";
import { Modal, Button, TextInput, Select } from "flowbite-react";
import { useGet } from "../hooks/useGet";
import { useSelector } from "react-redux";
import { Progress } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link,useNavigate } from "react-router-dom";

export default function BudgetListpage() {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

		useEffect(() => {
			if (!user) {
				navigate("/");
			}
		}, [user]);

	// State for categories, subcategories, and modal
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [category, setCategory] = useState("");
	const [subcategory, setSubcategory] = useState("");
	const [limit, setLimit] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const [isCategoriesEmpty, setIsCategoriesEmpty] = useState(false);

	// Fetch top-level categories (parent === null) on mount
	useEffect(() => {
		const fetchTopLevelCategories = async () => {
			try {
				const response = await fetch(`${API_URL}/categories`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await response.json();
				if (data.length === 0) {
					setIsCategoriesEmpty(true);
				}
				if (response.ok) {
					const topLevelCategories = data.filter((cat) => cat.parent === null);
					setCategories(topLevelCategories);
				} else {
					if (user) toast.error("Failed to fetch categories.");
				}
			} catch (error) {
				console.error(error);
				toast.error("An error occurred while fetching categories.");
			}
		};

		fetchTopLevelCategories();
	}, [API_URL, token, user]);

	// Fetch subcategories when a category is clicked
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
			setCategory(category._id);

			// Fetch subcategories only once when a category is clicked
			const children = await fetchCategoryFamily(category._id);
			if (children.length > 0) {
				setSubcategories(children); // Set children for the selected category
			} else {
				setSubcategories([]); // No children, so reset subcategories
			}
		} else {
			// If the same category is clicked again, clear the subcategories
			setSelectedCategory(null);
			setSubcategories([]);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!category || !limit)
			return alert("Please fill in all required fields.");

		try {
			await axios.post(
				`${API_URL}/budgets`,
				{ category, subcategory, limit: Number(limit) },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Budget created successfully!");
			handleCloseModal(); // Close modal after successful creation
		} catch (err) {
			console.error("Failed to create budget", err);
			toast.error("Failed to create budget.");
		}
	};

	// Close the modal and reset state
	const handleCloseModal = () => {
		setModalOpen(false);
		setCategory("");
		setSubcategory("");
		setLimit("");
		setSelectedCategory(null);
		setSubcategories([]);
	};

	// Open the modal
	const handleOpenModal = () => setModalOpen(true);

	// Fetch budgets from the API
	const {
		data: budgets = [],
		error,
		isLoading,
	} = useGet(`${API_URL}/budgets`, token, 5000);

	// If loading, show skeleton loaders
	if (isLoading) {
		return (
			<section className='lg:px-[7rem] md:px-[5rem] px-5 pt-28 min-h-screen bg-slate-100'>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
					{[...Array(6)].map((_, index) => (
						<div
							key={index}
							className='animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md'>
							<div className='h-6 bg-gray-300 rounded w-2/3 mb-4'></div>
							<div className='h-4 bg-gray-300 rounded w-full mb-2'></div>
							<div className='h-4 bg-gray-300 rounded w-1/2'></div>
						</div>
					))}
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<p className='text-red-500 text-center'>
				Failed to load budgets: {error.message}
			</p>
		);
	}

	return (
		<section className='lg:px-[7rem] md:px-[5rem] px-5 pt-28 min-h-screen bg-slate-100'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-xl font-semibold'>Budgets</h1>
				<Button onClick={handleOpenModal}>Create New Budget</Button>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{budgets.map((budget) => {
					const categoryName = budget?.category?.name
						? budget.category.name.charAt(0).toUpperCase() +
						  budget.category.name.slice(1)
						: "Unknown Category";
					const progress = Math.min(
						((budget.currentSpending || 0) / (budget.limit || 1)) * 100,
						100
					);

					return (
						<div
							key={budget._id}
							className='p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
								{categoryName}
							</h3>
							<p
								className={`text-sm font-medium mb-4 ${
									progress === 100
										? "text-red-500"
										: progress > 75
										? "text-yellow-500"
										: "text-green-500"
								}`}>
								Rwf{budget.currentSpending} / Rwf{budget.limit}
							</p>
							<Progress
								progress={progress}
								color={
									progress === 100 ? "red" : progress > 75 ? "yellow" : "green"
								}
								className='h-4'
							/>
						</div>
					);
				})}
			</div>

			{/* Modal for creating a new budget */}
			<Modal show={isModalOpen} onClose={handleCloseModal} size='md'>
				<Modal.Header>Create New Budget</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{isCategoriesEmpty? (<Link to='/categories' className='text-primaryColor underline'>Fisr of all, click 👉here to create Category.</Link>):(<Select
							required
							onChange={(e) => handleCategoryClick(e.target.value)}
							value={category}
							placeholder='Select Category'>
							<option value='' disabled>
								Select Category
							</option>
							{categories.map((cat) => (
								<option key={cat._id} value={cat._id}>
									{cat.name}
								</option>
							))}
						</Select>)}

						{subcategories.length > 0 && (
							<Select
								onChange={(e) => setSubcategory(e.target.value)}
								value={subcategory}
								placeholder='Select Subcategory'>
								<option value='' disabled>
									Select Subcategory
								</option>
								{subcategories.map((sub) => (
									<option key={sub._id} value={sub._id}>
										{sub.name}
									</option>
								))}
							</Select>
						)}

						<TextInput
							required
							type='number'
							placeholder='Enter Limit'
							value={limit}
							onChange={(e) => setLimit(e.target.value)}
						/>

						<div className='flex justify-end'>
							<Button type='submit'>Save Budget</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</section>
	);
}
