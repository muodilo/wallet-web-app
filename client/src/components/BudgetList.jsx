import { useGet } from "../hooks/useGet";
import { Progress } from "flowbite-react";
import { useSelector } from "react-redux";

export default function BudgetList() {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	// Fetch budgets from the API
	const {
		data: budgets=[],
		error,
		isLoading,
	} = useGet(`${API_URL}/budgets`, token, 5000);

	if (isLoading) {
		return <p>Loading budgets...</p>;
	}

	if (error) {
		return <p className='text-red-500'>Failed to load budgets</p>;
	}

	if (budgets.length === 0) {
		return <p>No budgets found</p>;
	}

	return (
		<div className='w-full p-4 bg-white rounded-lg shadow-md dark:bg-gray-800'>
			<h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
				Budgets
			</h2>
			{budgets.map((budget) => {
				const progress = Math.min(
					(budget.currentSpending / budget.limit) * 100,
					100
				); // Prevent progress from exceeding 100%

				return (
					<div key={budget._id} className='mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<span className='text-gray-900 dark:text-white'>
								{budget.category.name.charAt(0).toUpperCase() +
									budget.category.name.slice(1)}
							</span>
							<span
								className={`text-sm font-medium ${
									progress === 100
										? "text-red-500"
										: progress > 75
										? "text-yellow-500"
										: "text-green-500"
								}`}>
								Rwf{budget.currentSpending} / Rwf{budget.limit}
							</span>
						</div>
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
	);
}
