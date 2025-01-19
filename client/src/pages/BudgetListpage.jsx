import { useState, useEffect } from "react";
import { Modal, Button, TextInput, Select, Progress } from "flowbite-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline, IoMdTrash } from "react-icons/io";
import { useGet } from "../hooks/useGet";

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

	// State for categories and modal
	const [categories, setCategories] = useState([]);
	const [category, setCategory] = useState("");
	const [limit, setLimit] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);

	// Fetch all categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch(`${API_URL}/categories`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await response.json();
				if (response.ok) {
					setCategories(data);
				} else {
					toast.error("Failed to fetch categories.");
				}
			} catch (error) {
				console.error(error);
				toast.error("An error occurred while fetching categories.");
			}
		};

		fetchCategories();
	}, [API_URL, token]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!category || !limit)
			return toast.error("Please fill in all required fields.");

		// Find the selected category and check its type
		const selectedCategory = categories.find((cat) => cat._id === category);
		if (!selectedCategory || selectedCategory.type !== "Expense")
			return toast.error("Budget can only be created for Expense categories.");

		try {
			const response = await axios.post(
				`${API_URL}/budgets`,
				{ category, limit: Number(limit) },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Check the status code for success (200-299 is success)
			if (response.status >= 200 && response.status < 300) {
				toast.success("Budget created successfully!");
				handleCloseModal(); // Close modal after successful creation
			} else {
				toast.error(response.data?.message || "Failed to create budget.");
			}
		} catch (err) {
			console.error("Failed to create budget", err);
			toast.error(err.response?.data?.message || "Failed to create budget.");
		}
	};

	// Close the modal and reset state
	const handleCloseModal = () => {
		setModalOpen(false);
		setCategory("");
		setLimit("");
	};

	// Open the modal
	const handleOpenModal = () => setModalOpen(true);

	// Fetch budgets from the API
	const {
		data: budgets = [],
		error,
		isLoading,
	} = useGet(`${API_URL}/budgets`, token, 5000);

	// Handle delete
	const handleDelete = async (id) => {
		// Show confirmation dialog before proceeding with deletion
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this account?"
		);

		if (!isConfirmed) {
			return; // If the user cancels, stop the deletion
		}
		try {
			const response = await axios.delete(`${API_URL}/budgets/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.status === 200) {
				toast.success("Budget deleted successfully!");
			} else {
				toast.error("Failed to delete budget.");
			}
		} catch (err) {
			console.error("Failed to delete budget", err);
			toast.error("An error occurred while deleting the budget.");
		}
	};

	// If loading, show skeleton loaders
	if (isLoading) {
		return (
			<section className='lg:px-[7rem] md:px-[5rem] px-5 pt-28 min-h-screen bg-slate-100 pb-10'>
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

				<button
					className='bg-primaryColor text-white px-4 py-2 rounded flex items-center gap-1'
					onClick={handleOpenModal}>
					<IoIosAddCircleOutline />
					<p className='text-xs'>Create New Budget</p>
				</button>
			</div>

			{budgets.length === 0 && (
				<p className='text-gray-500'>No budgets found.</p>
			)}

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
							<div className='flex justify-between items-start'>
								<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
									{categoryName}
								</h3>
								<button
									onClick={() => handleDelete(budget._id)}
									className='text-red-500 hover:text-red-700'>
									<IoMdTrash />
								</button>
							</div>

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
						<Select
							required
							onChange={(e) => setCategory(e.target.value)}
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
						</Select>

						<TextInput
							type='number'
							required
							value={limit}
							onChange={(e) => setLimit(e.target.value)}
							label='Limit'
							placeholder='Enter the budget limit'
						/>

						{/* Button is inside the form now */}
						<Button type='submit'>Create Budget</Button>
					</form>
				</Modal.Body>
			</Modal>
		</section>
	);
}
