import { useSelector } from "react-redux";
import BarChartView from "../components/BarChartView";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaDownLong } from "react-icons/fa6";
import PieChartView from "../components/PieChartView";
import { useEffect, useState, useRef } from "react";
import { useGet } from "../hooks/useGet";
import CurrentTransaction from "../components/CurrentTransaction";
import BudgetList from "../components/BudgetList";
import CreateTransactionModal from "../components/CreateTransactionModal";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { FiDownloadCloud } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";

const capitalizeFirstLetter = (string) => {
	if (!string) return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Dashboard = () => {
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	const { data: transactionsSummary } = useGet(
		`${API_URL}/transactions/summary`,
		token,
		5000
	);

	const { data: budgets } = useGet(`${API_URL}/budgets`, token, 5000);

	const navigate = useNavigate();
	const reportRef = useRef(null); // Reference to the report section

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
	const [showAlert, setShowAlert] = useState({
		budgetExceeded: false,
		budgetAlmostComplete: false,
		alertMessage: "",
	});

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const closeAlert = (alertType) => {
		setShowAlert((prev) => ({
			...prev,
			[alertType]: false,
		}));
	};

	// Logic for displaying alerts based on budget data
	useEffect(() => {
		budgets?.forEach((budget) => {
			const { currentSpending, limit, category } = budget;

			if (currentSpending >= limit) {
				setShowAlert((prev) => ({
					...prev,
					budgetExceeded: true,
					alertMessage: `Your ${category.name} budget has exceeded the limit!`,
				}));
			} else if (currentSpending >= limit * 0.9) {
				setShowAlert((prev) => ({
					...prev,
					budgetAlmostComplete: true,
					alertMessage: `Your ${category.name} budget is almost complete!`,
				}));
			}
		});
	}, [budgets]);

	// Generate PDF Report
const generateReport = async () => {
	const element = reportRef.current;

	try {
		// Convert the element to a PNG image
		const dataUrl = await toPng(element, { quality: 0.95 });

		// Create a PDF and add the image
		const pdf = new jsPDF("portrait", "mm", "a4");
		const imgWidth = 190; // Adjust width for PDF
		let imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;

		// If the screen size is small, scale down the image
		if (window.innerWidth <= 768) {
			imgHeight = imgHeight * 0.7; // Further scale down for small screens
		}

		// Adding the title and padding top
		const todayDate = new Date().toLocaleDateString(); // Get today's date
		pdf.setFontSize(14);
		pdf.text(`Your Wallet App Report - ${todayDate}`, 10, 10);

		// Add some padding before adding the image
		pdf.addImage(dataUrl, "PNG", 10, 20, imgWidth, imgHeight);

		// Save the PDF
		pdf.save("dashboard-report.pdf");
	} catch (error) {
		console.error("Failed to generate report:", error);
	}
};


	return (
		<section className='lg:px-[7rem] md:px-[5rem] px-5 bg-slate-100 min-h-screen pb-10'>
			<div className='pt-24'>
				{/* Alert for budget exceeded */}
				{showAlert.budgetExceeded && (
					<div className='bg-red-500 text-white p-4 rounded-md mb-4 flex items-center justify-between'>
						<Link to='/budgets' className='font-semibold hover:underline'>
							{showAlert.alertMessage}
						</Link>
						<button
							onClick={() => closeAlert("budgetExceeded")}
							className='ml-4 text-white font-bold'>
							X
						</button>
					</div>
				)}

				{/* Alert for budget almost complete */}
				{showAlert.budgetAlmostComplete && (
					<div className='bg-yellow-500 text-white p-4 rounded-md mb-4 flex items-center justify-between'>
						<Link to='/budgets' className='font-semibold hover:underline'>
							{showAlert.alertMessage}
						</Link>
						<button
							onClick={() => closeAlert("budgetAlmostComplete")}
							className='ml-4 text-white font-bold'>
							X
						</button>
					</div>
				)}

				<div className='flex items-center justify-between mb-5'>
					<p className='text-xl font-bold'>
						Welcome back, {capitalizeFirstLetter(user?.firstname)} 👋
					</p>
					<div className='flex items-center gap-4'>
						<button
							onClick={generateReport}
							className='bg-primaryColor text-white px-4 py-2 rounded flex items-center gap-1'>
							<FiDownloadCloud />
							<p className='text-xs'>Generate Report</p>
						</button>
						<button
							onClick={openModal}
							className='bg-primaryColor text-white px-4 py-2 rounded flex items-center gap-1'>
							<IoIosAddCircleOutline />
							<p className="text-xs">Create transaction</p>
						</button>
					</div>
				</div>

				{/* Report Section */}
				<div ref={reportRef} className='pt-4'>
					<CreateTransactionModal isOpen={isModalOpen} onClose={closeModal} />

					{/* Overview */}
					<div className='mb-5'>
						<div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 px-2'>
							<div className='rounded-lg bg-white shadow'>
								<BarChartView />
							</div>
							<div className='flex flex-col gap-2'>
								<div className='border flex-1 rounded-lg bg-white flex flex-col shadow'>
									<div className='flex-1 p-4'>
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
						<div className='lg:col-span-2 md:col-span-2 col-span-1 rounded-lg bg-white p-4 shadow'>
							<CurrentTransaction transactionsSummary={transactionsSummary} />
						</div>
						<div className='rounded-lg '>
							<BudgetList budgets={budgets} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
