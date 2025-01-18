import  { useState, useEffect } from "react";
import AllTransactions from "../components/AllTransactions";
import CreateTransactionModal from "../components/CreateTransactionModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Transactions = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const navigate = useNavigate();
		const { user } = useSelector((state) => state.reducer.auth);

		useEffect(() => {
			if (!user) {
				navigate("/");
			}
		}, [user]);

	return (
		<div className='lg:px-[7rem] md:px-[5rem] px-5 pt-28 min-h-screen'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-xl font-semibold'>All Transactions</h2>
				<button
					onClick={openModal}
					className='bg-primaryColor text-white px-4 py-2 rounded hover:bg-primaryColor'>
					Create transaction
				</button>
			</div>

			{/* Modal for creating a new transaction */}
			<CreateTransactionModal isOpen={isModalOpen} onClose={closeModal} />

			{/* All Transactions Component */}
			<AllTransactions />
		</div>
	);
};

export default Transactions;
