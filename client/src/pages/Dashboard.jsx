import { useSelector } from "react-redux";
import BarChartView from "../components/BarChartView";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaDownLong } from "react-icons/fa6";
import PieChartView from "../components/PieChartView";
import { useEffect } from "react";
import { useGet } from "../hooks/useGet";
import  CurrentTransaction  from "../components/CurrentTransaction";
import BudgetList from "../components/BudgetList";
import { useState } from "react";
import CreateTransactionModal from "../components/CreateTransactionModal";

const capitalizeFirstLetter = (string) => {
	if (!string) return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Dashboard = () => {
	const { user } = useSelector((state) => state.reducer.auth);

	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	const {
		data: transactionsSummary,
	} = useGet(`${API_URL}/transactions/summary`, token,5000);


	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user]);

	// Extract totals for income and expenses
	const totalIncome =
		transactionsSummary?.find((item) => item.type === "Income")?.totalAmount ||
		0;
	const totalExpenses =
		transactionsSummary?.find((item) => item.type === "Expense")?.totalAmount ||
    0;
  
  	const [isModalOpen, setIsModalOpen] = useState(false);

		const openModal = () => setIsModalOpen(true);
		const closeModal = () => setIsModalOpen(false);

	return (
		<section className='lg:px-[7rem] md:px-[5rem] px-5 bg-slate-100 min-h-screen'>
			<div className='pt-24 '>
				<div className='flex items-center justify-between mb-5'>
					<p className='text-xl font-bold'>
						Welcome back, {capitalizeFirstLetter(user?.firstname)} 👋
					</p>
					<button
						onClick={openModal}
						className='bg-primaryColor text-white px-4 py-2 rounded hover:bg-blue-600'>
						Create transaction
					</button>
				</div>

				<CreateTransactionModal isOpen={isModalOpen} onClose={closeModal} />

				{/* Overview */}
				<div className='mb-5'>
					<div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 px-2'>
						<div className='rounded-lg bg-white shadow'>
							<BarChartView />
						</div>
						<div className='flex flex-col gap-2'>
							<div className='border flex-1 rounded-lg bg-white flex flex-col shadow'>
								<div className='flex-1 p-4 '>
									<div className='flex items-center justify-between'>
										<p className='mb-5'>Total Income</p>
										<CiMenuKebab className='cursor-pointer' />
									</div>
									<div className='flex items-center gap-2'>
										<FaDownLong className='text-green-500 rotate-180' />
										<p className='font-bold text-2xl '>
											{totalIncome.toLocaleString()} Rwf
										</p>
									</div>
								</div>

								<hr />
								<div className='py-1 text-center'>
									<Link
										to='/transactions'
										className='text-md text-primaryColor'>
										View all transactions
									</Link>
								</div>
							</div>
							<div className='border flex-1 rounded-lg bg-white flex flex-col shadow'>
								<div className='flex-1 p-4 '>
									<div className='flex items-center justify-between'>
										<p className='mb-5'>Total Expenses</p>
										<CiMenuKebab className='cursor-pointer' />
									</div>
									<div className='flex items-center gap-2'>
										<FaDownLong className='text-red-500' />
										<p className='font-bold text-2xl '>
											{totalExpenses.toLocaleString()} Rwf
										</p>
									</div>
								</div>

								<hr />
								<div className='py-1 text-center'>
									<Link
										to='/transactions'
										className='text-md text-primaryColor'>
										View all transactions
									</Link>
								</div>
							</div>
						</div>
						<div className='rounded-lg bg-white flex items-center shadow'>
							<PieChartView />
						</div>
					</div>
				</div>
				{/* current transactions */}
				<div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2'>
					<div className='lg:col-span-2 px-2 md:grid-cols-1  rounded'>
						<div className='bg-white shadow rounded px-1'>
							<CurrentTransaction />
						</div>
					</div>
					<div className='col-span-1 '>
						<BudgetList />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
