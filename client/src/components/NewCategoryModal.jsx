import  { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const NewCategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const API_URL = import.meta.env.VITE_API_URL;
	const token = localStorage.getItem("authToken"); // Replace with your preferred token storage method

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name.trim() || !type) {
			toast.error("Please fill in all fields.");
			return;
		}

		setIsLoading(true);

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
				toast.success("Category created successfully!");
				onCategoryCreated(data); // Notify the parent component of the new category
				onClose(); // Close the modal
				setName("");
				setType("");
			} else {
				toast.error(data.error || "Failed to create category.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while creating the category.");
		}

		setIsLoading(false);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white rounded-lg shadow-lg w-96 p-6'>
				<h2 className='text-xl font-bold mb-4'>Create New Category</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700'>
							Category Name
						</label>
						<input
							type='text'
							id='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
							placeholder='Enter category name'
						/>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='type'
							className='block text-sm font-medium text-gray-700'>
							Category Type
						</label>
						<select
							id='type'
							value={type}
							onChange={(e) => setType(e.target.value)}
							className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'>
							<option value=''>Select Type</option>
							<option value='Income'>Income</option>
							<option value='Expense'>Expense</option>
						</select>
					</div>
					<div className='flex justify-end gap-2'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isLoading}
							className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
								isLoading && "opacity-50 cursor-not-allowed"
							}`}>
							{isLoading ? "Creating..." : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

NewCategoryModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onCategoryCreated: PropTypes.func.isRequired,
};

export default NewCategoryModal;
