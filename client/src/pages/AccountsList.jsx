import { useState ,useEffect} from "react";
import { Card, Badge } from "flowbite-react";
import { useGet } from "../hooks/useGet"; // Custom hook for fetching data
import { useSelector } from "react-redux"; // Access Redux store
import { toast } from "react-toastify"; // For error handling
import CreateAccountModal from "../components/CreateAccountModal";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"; // Icons for delete and edit
import EditAccountModal from "../components/EditAccountModal"; // Edit modal component
import {useNavigate} from 'react-router-dom'

const AccountsList = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);

	// Open the Create Account Modal
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const navigate = useNavigate();

	// Close the Create Account Modal

	// Open the Edit Account Modal
	const openEditModal = (account) => {
		setSelectedAccount(account);
		setIsEditModalOpen(true);
	};

	// Close the Edit Account Modal
	const closeEditModal = () => {
		setSelectedAccount(null);
		setIsEditModalOpen(false);
	};

	// Retrieve user and token from Redux store
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;

		useEffect(() => {
			if (!user) {
				navigate("/");
			}
		}, [user]);

	// API URL
	const API_URL = import.meta.env.VITE_API_URL;

	// Fetch accounts data
	const {
		data: accounts,
		error,
		isLoading,
	} = useGet(`${API_URL}/accounts`, token, 1000);

	// Handle errors
	if (error) {
		toast.error("Failed to fetch accounts");
		return null;
	}

	// Format balance as RWF
	const formatRwf = (amount) => {
		return `${amount.toLocaleString("en-RW")} RWF`;
	};

	// Delete account handler
	const handleDelete = async (accountId) => {
		// Show confirmation dialog before proceeding with deletion
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this account?"
		);

		if (!isConfirmed) {
			return; // If the user cancels, stop the deletion
		}
		try {
			const response = await fetch(`${API_URL}/accounts/${accountId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to delete account");
			}

			toast.success("Account deleted successfully!");
			// Optionally, you can re-fetch or remove the deleted account from the state
		} catch (error) {
			toast.error(error.message || "Failed to delete account");
		}
	};

	return (
		<div className='lg:px-[7rem] md:px-[5rem] px-5 pt-28 min-h-screen bg-slate-100'>
			<div className='flex items-center justify-between mb-5'>
				<h2 className='text-2xl font-bold mb-4'>Accounts</h2>
				<button
					onClick={openModal}
					className='bg-primaryColor text-white px-4 py-2 rounded hover:bg-primaryColor'>
					Create account
				</button>
				<CreateAccountModal isOpen={isModalOpen} closeModal={closeModal} />
			</div>

			{isLoading ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{[...Array(3)].map((_, index) => (
						<Card
							key={index}
							className='shadow-md bg-gray-200 animate-pulse dark:bg-gray-700'>
							<div className='flex flex-col items-start space-y-3'>
								<div className='w-1/2 h-6 skeleton' /> {/* Skeleton for name */}
								<div className='w-1/3 h-4 skeleton' />{" "}
								{/* Skeleton for account type */}
								<div className='w-3/4 h-6 skeleton' />{" "}
								{/* Skeleton for balance */}
							</div>
						</Card>
					))}
				</div>
			) : accounts?.length === 0 ? (
				<p>No accounts found.</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{accounts?.map((account) => (
						<Card key={account._id} className='shadow-md'>
							<div className='flex flex-col items-start space-y-3'>
								<h3 className='text-xl font-semibold'>{account.name}</h3>
								<Badge color={account.accountType === "Bank" ? "blue" : "gray"}>
									{account.accountType}
								</Badge>
								<p className='text-lg font-medium text-green-600'>
									Balance: {formatRwf(account.balance)}
								</p>
								<div className='flex space-x-3'>
									<AiOutlineEdit
										className='text-blue-600 cursor-pointer'
										onClick={() => openEditModal(account)}
									/>
									<AiOutlineDelete
										className='text-red-600 cursor-pointer'
										onClick={() => handleDelete(account._id)}
									/>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Edit Account Modal */}
			<EditAccountModal
				isOpen={isEditModalOpen}
				closeModal={closeEditModal}
				account={selectedAccount}
			/>
		</div>
	);
};

export default AccountsList;
