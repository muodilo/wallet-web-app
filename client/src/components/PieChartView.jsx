import { PieChart } from "@mui/x-charts/PieChart";
import { useGet } from "../hooks/useGet";
import { useSelector } from "react-redux";

export default function PieChartView() {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	// Fetch account data dynamically
	const {
		data: accounts,
		error,
		isLoading,
	} = useGet(`${API_URL}/accounts`, token, 5000);

	// Helper function to truncate text
	const truncateText = (text, maxLength) => {
		return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
	};

	// Prepare data for the pie chart with truncated labels
	const pieData = accounts
		? accounts.map((account, index) => ({
				id: index,
				value: account.balance,
				label: truncateText(account.name, 5), // Truncate labels directly here
		  }))
		: [];

	// Calculate total balance
	const totalBalance = accounts
		? accounts.reduce((sum, account) => sum + account.balance, 0)
		: 0;

	return (
		<div className='w-full flex flex-col items-center'>
			<h2 className='text-lg font-semibold '>Accounts Balance</h2>
			{/* Display total balance */}
			<p className='text-gray-600 mb-1'>
				Total Balance: Rwf{totalBalance.toLocaleString()}
			</p>
			{isLoading ? (
				<div className='flex justify-center items-center h-60'>
					<div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent'></div>
				</div>
			) : error ? (
				<p className='text-red-500'>Error loading accounts data</p>
			) : (
				<div className='flex flex-col items-center'>
					{/* Render Pie Chart */}
					<PieChart
						className='flex flex-col items-center'
						series={[
							{
								data: pieData,
							},
						]}
						width={300}
						height={300}
					/>
				</div>
			)}
		</div>
	);
}
