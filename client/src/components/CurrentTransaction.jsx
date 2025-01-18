import { Table, Badge } from "flowbite-react";
import { useGet } from "../hooks/useGet";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function CurrentTransaction() {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	const {
		data: transactions = [],
		error,
		isLoading,
	} = useGet(`${API_URL}/transactions`, token);

	if (isLoading) {
		return (
			<div className='overflow-x-auto'>
				<h2 className='text-xl font-semibold mb-4'>Recent Transactions</h2>
				<Table hoverable>
					<Table.Head>
						<Table.HeadCell>Date</Table.HeadCell>
						<Table.HeadCell>Description</Table.HeadCell>
						<Table.HeadCell>Account</Table.HeadCell>
						<Table.HeadCell>Category</Table.HeadCell>
						<Table.HeadCell>Type</Table.HeadCell>
						<Table.HeadCell>Amount</Table.HeadCell>
					</Table.Head>
					<Table.Body className='divide-y'>
						{Array.from({ length: 3 }).map((_, index) => (
							<Table.Row
								key={index}
								className='bg-gray-200 animate-pulse dark:bg-gray-700'>
								{Array.from({ length: 6 }).map((_, idx) => (
									<Table.Cell
										key={idx}
										className='h-6 bg-gray-300 rounded dark:bg-gray-600'></Table.Cell>
								))}
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		);
	}

	if (error) {
		return <p className='text-red-500'>Failed to load transactions</p>;
	}

	if (transactions.length === 0) {
		return (
			<div className='text-center'>
				<h2 className='text-xl font-semibold mb-4'>Recent Transactions</h2>
				<p className='text-gray-500'>No transactions found. <Link className="text-primaryColor underline" to='/transactions'>go to transactions page to create one</Link></p>
			</div>
		);
	}

	// Sort the transactions by createdAt in descending order and take the top 3
	const sortedTransactions = transactions
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 3);

	return (
		<div className='overflow-x-auto'>
			<h2 className='text-xl font-semibold mb-4'>Recent Transactions</h2>
			<Table hoverable>
				<Table.Head>
					<Table.HeadCell>Date</Table.HeadCell>
					<Table.HeadCell>Description</Table.HeadCell>
					<Table.HeadCell>Account</Table.HeadCell>
					<Table.HeadCell>Category</Table.HeadCell>
					<Table.HeadCell>Type</Table.HeadCell>
					<Table.HeadCell>Amount</Table.HeadCell>
				</Table.Head>
				<Table.Body className='divide-y'>
					{sortedTransactions.map((transaction) => (
						<Table.Row
							key={transaction._id}
							className='bg-white dark:border-gray-700 dark:bg-gray-800'>
							<Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
								{format(new Date(transaction.createdAt), "PPpp")}
							</Table.Cell>
							<Table.Cell>{transaction?.description}</Table.Cell>
							<Table.Cell>{transaction?.account.name}</Table.Cell>
							<Table.Cell>{transaction?.category.name}</Table.Cell>
							<Table.Cell>
								<Badge
									color={transaction?.type === "Income" ? "success" : "failure"}
									size='sm'>
									{transaction?.type}
								</Badge>
							</Table.Cell>
							<Table.Cell
								className={
									transaction?.type === "Income"
										? "text-green-500 font-semibold"
										: "text-red-500 font-semibold"
								}>
								{transaction?.type === "Income" ? "+" : "-"}Rwf
								{transaction?.amount}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</div>
	);
}
