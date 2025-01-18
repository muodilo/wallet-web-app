import { Table, Badge, Modal, Button, TextInput } from "flowbite-react";
import { useGet } from "../hooks/useGet";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const AllTransactions = () => {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	// Fetch transactions
	const {
		data: transactions,
		error,
		isLoading,
	} = useGet(`${API_URL}/transactions`, token, 5000);

	// Fetch accounts and categories
	const { data: accounts } = useGet(`${API_URL}/accounts`, token, 5000);
	const { data: categories } = useGet(`${API_URL}/categories`, token, 5000);

	// State for filters
	const [searchText, setSearchText] = useState("");
	const [selectedRange, setSelectedRange] = useState([null, null]);
	const [filterType, setFilterType] = useState("");

	// State for edit modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editedTransaction, setEditedTransaction] = useState(null);
	const [subcategories, setSubcategories] = useState([]);

	// State for deleting (track specific transaction)
	const [deletingTransactionId, setDeletingTransactionId] = useState(null);

	// Extract start and end dates from selected range
	const [startDate, endDate] = selectedRange;

	// Handle filter changes
	const handleSearchChange = (e) => setSearchText(e.target.value);
	const handleTypeChange = (e) => setFilterType(e.target.value);
	const handleDateRangeChange = (dates) => {
		const [start, end] = dates;
		setSelectedRange([start, end]);
	};

	// Handle category change and load subcategories
	const handleCategoryChange = (categoryId) => {
		const selectedCategory = categories?.find(
			(category) => category._id === categoryId
		);
		setSubcategories(selectedCategory?.subcategories || []);
	};

	// Filter transactions
	const filteredTransactions = transactions
		? transactions.filter((transaction) => {
				const matchesSearch = searchText
					? transaction.description
							.toLowerCase()
							.includes(searchText.toLowerCase())
					: true;

				const matchesType = filterType ? transaction.type === filterType : true;

				const matchesDate =
					startDate || endDate
						? new Date(transaction.createdAt) >=
								(startDate || new Date("1970-01-01")) &&
						  new Date(transaction.createdAt) <= (endDate || new Date())
						: true;

				return matchesSearch && matchesType && matchesDate;
		  })
		: [];

	// Skeleton loader
	const renderSkeleton = () => {
		const skeletonRows = Array(5).fill(null);
		return skeletonRows.map((_, index) => (
			<Table.Row
				key={index}
				className='bg-white dark:bg-gray-800 animate-pulse'>
				<Table.Cell className='py-4'>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded'></div>
				</Table.Cell>
				<Table.Cell>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4'></div>
				</Table.Cell>
				<Table.Cell>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2'></div>
				</Table.Cell>
				<Table.Cell>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3'></div>
				</Table.Cell>
				<Table.Cell>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4'></div>
				</Table.Cell>
				<Table.Cell>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4'></div>
				</Table.Cell>
				<Table.Cell>
					<div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/6'></div>
				</Table.Cell>
			</Table.Row>
		));
	};

	// Handle edit modal toggle and set transaction for editing
	const openEditModal = (transaction) => {
		setEditedTransaction(transaction);
		setIsModalOpen(true);
		handleCategoryChange(transaction.category._id); // Load subcategories for the selected category
	};

	const closeEditModal = () => {
		setIsModalOpen(false);
		setEditedTransaction(null);
	};

	// Handle edit form submission
	const handleEditSubmit = async () => {
		if (!editedTransaction) return;

		try {
			const response = await fetch(
				`${API_URL}/transactions/${editedTransaction._id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(editedTransaction),
				}
			);

			if (response.ok) {
				toast.success("Transaction updated successfully!");
				closeEditModal();
			} else {
				toast.error("Failed to update transaction.");
			}
		} catch (error) {
			console.error("Error updating transaction:", error);
			toast.error("Failed to update transaction.");
		}
	};

	// Handle delete transaction
	const handleDelete = async (transactionId) => {
		setDeletingTransactionId(transactionId); // Set specific transaction to delete

		try {
			const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				toast.success("Transaction deleted successfully!");
			} else {
				toast.error("Failed to delete transaction.");
			}
		} catch (error) {
			console.error("Error deleting transaction:", error);
			toast.error("Failed to delete transaction.");
		} finally {
			setDeletingTransactionId(null); // Reset deleting state
		}
	};

	if (error) {
		return (
			<div className='overflow-x-auto'>
				<h2 className='text-xl font-semibold mb-4'>All Transactions</h2>
				<p className='text-red-500'>Failed to load transactions</p>
			</div>
		);
	}
	if (transactions?.length === 0) {
		return (
			<div className='overflow-x-auto'>
				<h2 className='text-xl font-semibold mb-4'></h2>
				<p className='text-gray-500'>No transaction yet</p>
			</div>
		);
	}

	return (
		<div className='overflow-x-auto'>
			<div className='flex flex-col md:flex-row gap-4 mb-4'>
				<input
					type='text'
					placeholder='Search by description...'
					value={searchText}
					onChange={handleSearchChange}
					className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>

				<DatePicker
					selected={startDate}
					onChange={handleDateRangeChange}
					startDate={startDate}
					endDate={endDate}
					selectsRange
					isClearable
					placeholderText='Select date range'
					className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>

				<select
					value={filterType}
					onChange={handleTypeChange}
					className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
					<option value=''>All Types</option>
					<option value='Income'>Income</option>
					<option value='Expense'>Expense</option>
				</select>
			</div>

			<Table hoverable>
				<Table.Head>
					<Table.HeadCell>Date</Table.HeadCell>
					<Table.HeadCell>Description</Table.HeadCell>
					<Table.HeadCell>Account</Table.HeadCell>
					<Table.HeadCell>Category</Table.HeadCell>
					<Table.HeadCell>Type</Table.HeadCell>
					<Table.HeadCell>Amount</Table.HeadCell>
					<Table.HeadCell>Actions</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{isLoading
						? renderSkeleton()
						: filteredTransactions.map((transaction) => (
								<Table.Row
									key={transaction._id}
									className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
										{format(new Date(transaction.createdAt), "PPpp")}
									</Table.Cell>
									<Table.Cell>{transaction?.description}</Table.Cell>
									<Table.Cell>{transaction?.account?.name}</Table.Cell>
									<Table.Cell>{transaction?.category?.name}</Table.Cell>
									<Table.Cell>
										<Badge
											color={
												transaction.type === "Income" ? "success" : "failure"
											}
											size='sm'>
											{transaction.type}
										</Badge>
									</Table.Cell>
									<Table.Cell>{transaction.amount}</Table.Cell>
									<Table.Cell className='flex gap-2'>
										<Button onClick={() => openEditModal(transaction)}>
											<Edit size={16} />
										</Button>
										<Button
											onClick={() => handleDelete(transaction._id)}
											isLoading={deletingTransactionId === transaction._id}
											loadingText='Deleting'>
											<Trash size={16} />
										</Button>
									</Table.Cell>
								</Table.Row>
						  ))}
				</Table.Body>
			</Table>

			{isModalOpen && (
				<Modal show={isModalOpen} onClose={closeEditModal}>
					<Modal.Header>Edit Transaction</Modal.Header>
					<Modal.Body>
						<form onSubmit={handleEditSubmit}>
							<TextInput
								label='Description'
								value={editedTransaction?.description || ""}
								onChange={(e) =>
									setEditedTransaction({
										...editedTransaction,
										description: e.target.value,
									})
								}
							/>
							<select
								value={editedTransaction?.account._id || ""}
								onChange={(e) =>
									setEditedTransaction({
										...editedTransaction,
										account: accounts.find(
											(account) => account._id === e.target.value
										),
									})
								}
								className='w-full p-2 border border-gray-300 rounded-md'>
								<option value=''>Select Account</option>
								{accounts?.map((account) => (
									<option key={account._id} value={account._id}>
										{account?.name}
									</option>
								))}
							</select>
							<select
								value={editedTransaction?.category._id || ""}
								onChange={(e) => {
									const selectedCategory = categories.find(
										(category) => category._id === e.target.value
									);
									setEditedTransaction({
										...editedTransaction,
										category: selectedCategory,
									});
									handleCategoryChange(e.target.value);
								}}
								className='w-full p-2 border border-gray-300 rounded-md'>
								<option value=''>Select Category</option>
								{categories?.map((category) => (
									<option key={category._id} value={category._id}>
										{category?.name}
									</option>
								))}
							</select>
							{subcategories.length > 0 && (
								<select
									value={editedTransaction?.subcategory?._id || ""}
									onChange={(e) =>
										setEditedTransaction({
											...editedTransaction,
											subcategory: subcategories.find(
												(subcategory) => subcategory._id === e.target.value
											),
										})
									}
									className='w-full p-2 border border-gray-300 rounded-md'>
									<option value=''>Select Subcategory</option>
									{subcategories.map((subcategory) => (
										<option key={subcategory._id} value={subcategory._id}>
											{subcategory?.name}
										</option>
									))}
								</select>
							)}
							<TextInput
								label='Amount'
								type='number'
								value={editedTransaction?.amount || ""}
								onChange={(e) =>
									setEditedTransaction({
										...editedTransaction,
										amount: e.target.value,
									})
								}
							/>
							<Button type='submit'>Save Changes</Button>
						</form>
					</Modal.Body>
				</Modal>
			)}
		</div>
	);
};

export default AllTransactions;
