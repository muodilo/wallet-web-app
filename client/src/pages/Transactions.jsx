import  { useState } from "react";
import AllTransactions from "../components/AllTransactions";
import CreateTransactionModal from "../components/CreateTransactionModal";

const Transactions = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<div className='lg:px-[7rem] md:px-[5rem] px-5 pt-28 min-h-screen'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-xl font-semibold'>All Transactions</h2>
				<button
					onClick={openModal}
					className='bg-primaryColor text-white px-4 py-2 rounded hover:bg-blue-600'>
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
