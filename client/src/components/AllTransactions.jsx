import { Table, Badge } from "flowbite-react";
import { useGet } from "../hooks/useGet";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";


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

	// State for filters
	const [searchText, setSearchText] = useState("");
	const [selectedRange, setSelectedRange] = useState([null, null]);
	const [filterType, setFilterType] = useState("");

	// Extract start and end dates from selected range
	const [startDate, endDate] = selectedRange;

	// Handle filter changes
	const handleSearchChange = (e) => setSearchText(e.target.value);
	const handleTypeChange = (e) => setFilterType(e.target.value);
	const handleDateRangeChange = (dates) => {
		const [start, end] = dates;
		setSelectedRange([start, end]);
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

	if (error) {
		return (
			<div className='overflow-x-auto'>
				<h2 className='text-xl font-semibold mb-4'>All Transactions</h2>
				<p className='text-red-500'>Failed to load transactions</p>
			</div>
		);
	}

	return (
		<div className='overflow-x-auto'>
			
			<div className=''>
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
									<Table.Cell>{transaction.description}</Table.Cell>
									<Table.Cell>{transaction.account.name}</Table.Cell>
									<Table.Cell>{transaction.category.name}</Table.Cell>
									<Table.Cell>
										<Badge
											color={
												transaction.type === "Income" ? "success" : "failure"
											}
											size='sm'>
											{transaction.type}
										</Badge>
									</Table.Cell>
									<Table.Cell
										className={
											transaction.type === "Income"
												? "text-green-500 font-semibold"
												: "text-red-500 font-semibold"
										}>
										{transaction.type === "Income" ? "+" : "-"}Rwf
										{transaction.amount}
									</Table.Cell>
									<Table.Cell className='flex gap-2'>
										<button className='text-blue-500 hover:text-blue-700'>
											<Edit size={18} />
										</button>
										<button className='text-red-500 hover:text-red-700'>
											<Trash size={18} />
										</button>
									</Table.Cell>
								</Table.Row>
						  ))}
				</Table.Body>
			</Table>
		</div>
	);
};

export default AllTransactions;
