import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CategoriesPage = () => {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	const [categories, setCategories] = useState([]);
	const [newSubCategory, setNewSubCategory] = useState({});
	const [newSubCategoryType, setNewSubCategoryType] = useState({});
	const [collapsedCategories, setCollapsedCategories] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	// Fetch top-level categories and their subcategories
	const fetchCategories = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/categories`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await response.json();

			if (response.ok) {
				const topLevelCategories = data.filter((cat) => cat.parent === null);

				// Fetch subcategories for each top-level category
				const categoriesWithSubcategories = await Promise.all(
					topLevelCategories.map(async (category) => {
						const subCategories = await fetchCategoryFamily(category._id);
						return { ...category, subCategories };
					})
				);

				setCategories(categoriesWithSubcategories);
			} else {
				toast.error("Failed to fetch categories.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while fetching categories.");
		}
		setIsLoading(false);
	};

	// Fetch subcategories for a specific category
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

	// Add a subcategory
	const handleAddSubCategory = async (parentId) => {
		const subCategoryName = newSubCategory[parentId]?.trim();
		const subCategoryType = newSubCategoryType[parentId];

		if (!subCategoryName) {
			toast.error("Subcategory name cannot be empty.");
			return;
		}

		if (!subCategoryType) {
			toast.error("Subcategory type is required (Income or Expense).");
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
					name: subCategoryName,
					parent: parentId,
					type: subCategoryType,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Subcategory added successfully!");
				setNewSubCategory((prev) => ({ ...prev, [parentId]: "" }));
				setNewSubCategoryType((prev) => ({ ...prev, [parentId]: "" }));

				// Update the subcategories list
				const updatedSubCategories = await fetchCategoryFamily(parentId);
				setCategories((prevCategories) =>
					prevCategories.map((cat) =>
						cat._id === parentId
							? { ...cat, subCategories: updatedSubCategories }
							: cat
					)
				);
			} else {
				toast.error(data.error || "Failed to add subcategory.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while adding the subcategory.");
		}
	};

	// Delete a subcategory
	const handleDeleteSubCategory = async (subCategoryId, parentId) => {
		try {
			const response = await fetch(`${API_URL}/categories/${subCategoryId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.ok) {
				toast.success("Subcategory deleted successfully!");

				// Update the subcategories list
				const updatedSubCategories = await fetchCategoryFamily(parentId);
				setCategories((prevCategories) =>
					prevCategories.map((cat) =>
						cat._id === parentId
							? { ...cat, subCategories: updatedSubCategories }
							: cat
					)
				);
			} else {
				toast.error("Failed to delete subcategory.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while deleting the subcategory.");
		}
	};

	// Toggle collapse/expand for categories
	const toggleCollapse = (categoryId) => {
		setCollapsedCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<div className='lg:px-[7rem] md:px-[5rem] px-5 bg-slate-100 min-h-screen pt-28'>
			<h1 className='text-2xl font-bold mb-6'>Categories</h1>

			{isLoading ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className='h-40 bg-gray-300 rounded-lg animate-pulse'></div>
					))}
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{categories.map((category) => {
						const isCollapsed = collapsedCategories[category._id];
						return (
							<div
								key={category._id}
								className='border rounded-lg p-4 bg-white'>
								<div className='flex justify-between items-center mb-3'>
									<h2 className='text-lg font-semibold'>{category.name}</h2>
									<button
										onClick={() => toggleCollapse(category._id)}
										className='text-blue-500 hover:underline'>
										{isCollapsed
											? `Show Subcategories (${category.subCategories.length})`
											: "Hide Subcategories"}
									</button>
								</div>

								{!isCollapsed && (
									<ul className='list-disc ml-4'>
										{category.subCategories.map((sub) => (
											<li key={sub._id} className='flex items-center mb-2'>
												<span>{sub.name}</span>
												<button
													onClick={() =>
														handleDeleteSubCategory(sub._id, category._id)
													}
													className='ml-2 text-red-500 hover:underline'>
													Delete
												</button>
											</li>
										))}
									</ul>
								)}

								<div className='mt-4'>
									<input
										type='text'
										placeholder='New Subcategory Name'
										value={newSubCategory[category._id] || ""}
										onChange={(e) =>
											setNewSubCategory((prev) => ({
												...prev,
												[category._id]: e.target.value,
											}))
										}
										className='border rounded p-2 w-full'
									/>
									<select
										value={newSubCategoryType[category._id] || ""}
										onChange={(e) =>
											setNewSubCategoryType((prev) => ({
												...prev,
												[category._id]: e.target.value,
											}))
										}
										className='border rounded p-2 w-full mt-2'>
										<option value=''>Select Type</option>
										<option value='Income'>Income</option>
										<option value='Expense'>Expense</option>
									</select>
									<button
										onClick={() => handleAddSubCategory(category._id)}
										className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
										Add Subcategory
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
			{!isLoading && categories.length === 0 && <p>No categories found.</p>}
		</div>
	);
};

export default CategoriesPage;
