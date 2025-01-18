import { useState } from "react";
import { Modal, Button, TextInput, Select, Label } from "flowbite-react"; // Flowbite components
import { toast } from "react-toastify"; // For notifications
import { useSelector } from "react-redux"; 
import PropTypes from "prop-types";

const CreateAccountModal = ({ isOpen, closeModal }) => {
	// State for form fields
	const [name, setName] = useState("");
	const [accountType, setAccountType] = useState("Bank");
	const [balance, setBalance] = useState("");

	// Access token from Redux store
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;

	// API URL
	const API_URL = import.meta.env.VITE_API_URL;

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const accountData = {
			name,
			accountType,
			balance: parseFloat(balance),
		};

		try {
			const response = await fetch(`${API_URL}/accounts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(accountData),
			});

			if (!response.ok) {
				throw new Error("Failed to create account");
			}

			// const data = await response.json();
			toast.success("Account created successfully!");
			closeModal(); // Close modal after successful creation
		} catch (error) {
			toast.error(error.message || "Failed to create account");
		}
	};

	return (
		<Modal show={isOpen} onClose={closeModal}>
			<Modal.Header>Create New Account</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit}>
					{/* Account Name */}
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

					{/* Account Type */}
					<div className='mb-4'>
						<Label htmlFor='accountType' value='Account Type' />
						<Select
							id='accountType'
							value={accountType}
							onChange={(e) => setAccountType(e.target.value)}>
							<option value='Bank'>Bank</option>
							<option value='Mobile Money'>Mobile Money</option>
							<option value='Cash'>Cash</option>
						</Select>
					</div>

					{/* Balance */}
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

					{/* Submit Button */}
					<div className='flex justify-end'>
						<Button type='submit'>Create Account</Button>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	);
};

CreateAccountModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	closeModal: PropTypes.func.isRequired,
};

export default CreateAccountModal;
