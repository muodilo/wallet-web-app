import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

const CategoriesPage = () => {
const { user } = useSelector((state) => state.reducer.auth);
const token = user?.token;
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

const [categories, setCategories] = useState([]);
const [newSubCategory, setNewSubCategory] = useState({});
const [newSubCategoryType, setNewSubCategoryType] = useState({});
const [collapsedCategories, setCollapsedCategories] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [newCategory, setNewCategory] = useState({ name: "", type: "" });

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

// Add a new top-level category
const handleAddCategory = async () => {
const { name, type } = newCategory;

if (!name.trim()) {
toast.error("Category name cannot be empty.");
return;
}

if (!type) {
toast.error("Category type is required (Income or Expense).");
return;
}

try {
const response = await fetch(`${API_URL}/categories`, {
method: "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
body: JSON.stringify({ name, type }),
});

const data = await response.json();

if (response.ok) {
toast.success("Category added successfully!");
setNewCategory({ name: "", type: "" });
setShowModal(false);
fetchCategories(); // Refresh categories
} else {
toast.error(data.error || "Failed to add category.");
}
} catch (error) {
console.error(error);
toast.error("An error occurred while adding the category.");
}
};

// Toggle collapse/expand for categories
const toggleCollapse = (categoryId) => {
setCollapsedCategories((prev) => ({
...prev,
[categoryId]: !prev[categoryId],
}));
};


const handleDeleteCategory = async (categoryId) => {
	// Show confirmation dialog before proceeding with deletion
	const isConfirmed = window.confirm(
		"Are you sure you want to delete this category?"
	);

	if (!isConfirmed) {
		return; // If the user cancels, stop the deletion
	}

	try {
		const response = await fetch(`${API_URL}/categories/${categoryId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (response.ok) {
			toast.success("Category deleted successfully!");
			fetchCategories(); // Re-fetch categories after deletion
		} else {
			toast.error("Failed to delete category.");
		}
	} catch (error) {
		console.error(error);
		toast.error("An error occurred while deleting the category.");
	}
};

// Delete a subcategory
  const handleDeleteSubCategory = async (subCategoryId, parentId) => {
		// Show confirmation dialog before proceeding with deletion
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this subcategory?"
		);

		if (!isConfirmed) {
			return; // If the user cancels, stop the deletion
		}
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
			toast.info("Delete subcategories first before deleting the category.");
		}
	};

useEffect(() => {
fetchCategories();
}, []);
  

		useEffect(() => {
			if (!user) {
				navigate("/");
			}
    }, [user]);
  
  const deleteFatherDenyed = () => {
    toast.error("You cannot delete a category with subcategories.");
  }

return (
	<div className='lg:px-[7rem] md:px-[5rem] px-5 bg-slate-100 min-h-screen pt-28 pb-10'>
		<div className='flex items-center justify-between mb-5'>
			<h1 className='text-2xl font-bold mb-6'>Categories</h1>

			<div className='mb-4'>
				<button
					onClick={() => setShowModal(true)}
          className='px-4 py-2 bg-primaryColor text-white rounded flex items-center gap-1'>
          <IoIosAddCircleOutline/>
					<p className="text-xs">Add New Category</p>
				</button>
			</div>
		</div>

		{isLoading ? (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6'>
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						key={index}
						className='h-40 bg-gray-300 rounded-lg animate-pulse'></div>
				))}
			</div>
		) : (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{categories.map((category) => {
					const isCollapsed = collapsedCategories[category._id];
					return (
						<div key={category._id} className=''>
							<div className='border rounded-lg p-4 bg-white'>
								<div className='flex justify-between items-center mb-3'>
									<div className='flex items-center gap-2'>
										<h2 className='text-lg font-semibold'>{category?.name}</h2>
										<p className=''>
											<span
												className={`inline-block px-3 text-xs text-white rounded-full ${
													category.type === "Expense"
														? "bg-red-500"
														: "bg-green-500"
												}`}>
												{category.type}
											</span>
										</p>
									</div>
									<button
										onClick={() => toggleCollapse(category._id)}
										className='text-blue-500 hover:underline'>
										{!isCollapsed &&
											category.subCategories.length > 0 &&
											`Hide Subcategories (${category.subCategories.length}) `}
										{isCollapsed &&
											category.subCategories.length > 0 &&
											`Show SubcategorieS (${category.subCategories.length}) `}
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
									<p className='mb-1'>Create subcategory</p>
									<input
										type='text'
										required
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
										<option value={category?.type}>{category?.type}</option>
									</select>
									<button
										onClick={() => handleAddSubCategory(category._id)}
										className='mt-2 px-4 py-2 bg-primaryColor text-white rounded '>
										Add Subcategory
									</button>
								</div>

								{category.subCategories.length === 0 && (
									<div className='flex justify-end gap-2'>
										<AiOutlineDelete
											className='text-red-500 cursor-pointer'
											onClick={() => handleDeleteCategory(category._id)}
										/>
									</div>
								)}
								{category.subCategories.length > 0 && (
									<div className='flex justify-end gap-2'>
										<AiOutlineDelete
											onClick={deleteFatherDenyed}
											className='text-red-300 cursor-pointer'
										/>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		)}
		{!isLoading && categories.length === 0 && <p>No categories found.</p>}

		{/* Modal */}
		{showModal && (
			<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
				<div className='bg-white rounded-lg p-6 w-96'>
					<h2 className='text-xl font-bold mb-4'>Add New Category</h2>
					<input
						type='text'
						placeholder='Category Name'
						value={newCategory.name}
						onChange={(e) =>
							setNewCategory((prev) => ({ ...prev, name: e.target.value }))
						}
						className='border rounded p-2 w-full mb-4'
					/>
					<select
						value={newCategory.type}
						onChange={(e) =>
							setNewCategory((prev) => ({ ...prev, type: e.target.value }))
						}
						className='border rounded p-2 w-full mb-4'>
						<option value=''>Select Type</option>
						<option value='Income'>Income</option>
						<option value='Expense'>Expense</option>
					</select>
					<div className='flex justify-end'>
						<button
							onClick={() => setShowModal(false)}
							className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2'>
							Cancel
						</button>
						<button
							onClick={handleAddCategory}
							className='px-4 py-2 bg-primaryColor text-white rounded'>
							Add Category
						</button>
					</div>
				</div>
			</div>
		)}
	</div>
);
};

export default CategoriesPage;