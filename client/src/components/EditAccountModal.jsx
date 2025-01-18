import { useState, useEffect } from "react";
import { Modal, Button, TextInput, Select, Label } from "flowbite-react"; // Flowbite components
import { toast } from "react-toastify"; 
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const EditAccountModal = ({ isOpen, closeModal, account }) => {
	const [name, setName] = useState("");
	const [accountType, setAccountType] = useState("Bank");
  const [balance, setBalance] = useState("");
  
  	const { user } = useSelector((state) => state.reducer.auth);

		const token = user?.token;

	// Pre-fill form fields when the modal opens
	useEffect(() => {
		if (account) {
			setName(account?.name);
			setAccountType(account?.accountType);
			setBalance(account?.balance);
		}
	}, [account, isOpen]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const updatedAccountData = {
			name,
			accountType,
			balance: parseFloat(balance),
		};

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/accounts/${account?._id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(updatedAccountData),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update account");
			}

			toast.success("Account updated successfully!");
			closeModal(); // Close modal after successful update
		} catch (error) {
			toast.error(error.message || "Failed to update account");
		}
	};

	return (
		<Modal show={isOpen} onClose={closeModal}>
			<Modal.Header>Edit Account</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<Label htmlFor='name' value='Account Name' />
						<TextInput
							id='name'
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className='mb-4'>
						<Label htmlFor='accountType' value='Account Type' />
						<Select
							id='accountType'
							value={accountType}
							onChange={(e) => setAccountType(e.target.value)}>
							<option value='Bank'>Bank</option>
							<option value='Cash'>Cash</option>
							{/* Add more options if needed */}
						</Select>
					</div>
					<div className='mb-4'>
						<Label htmlFor='balance' value='Balance' />
						<TextInput
							id='balance'
							type='number'
							value={balance}
							onChange={(e) => setBalance(e.target.value)}
							required
						/>
					</div>
					<div className='flex justify-end'>
						<Button type='submit'>Update</Button>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	);
};

EditAccountModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	closeModal: PropTypes.func.isRequired,
	account: PropTypes.object,
};

export default EditAccountModal;
