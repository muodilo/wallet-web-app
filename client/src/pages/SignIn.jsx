import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const SignIn = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	// Handle input change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Form validation
	const validateForm = () => {
		const newErrors = {};

		if (!formData.email.trim()) newErrors.email = "Email is required.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
			newErrors.email = "Invalid email format.";
		if (!formData.password.trim()) newErrors.password = "Password is required.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0; // Return true if no errors
	};

	// Form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			console.log("Sign In Successful:", formData);
			toast.success("Logged in successfully");
			setFormData({
				email: "",
				password: "",
			});
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md  p-8 rounded-lg '>
				<h2 className='text-2xl font-bold text-center mb-6'>Sign In</h2>
				<form onSubmit={handleSubmit}>
					{/* Email */}
					<div className='mb-4'>
						<label className='block text-gray-700 font-semibold mb-1'>
							Email
						</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg ${
								errors.email ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.email && (
							<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
						)}
					</div>

					{/* Password */}
					<div className='mb-4'>
						<label className='block text-gray-700 font-semibold mb-1'>
							Password
						</label>
						<div className='relative'>
							<input
								type={showPassword ? "text" : "password"}
								name='password'
								value={formData.password}
								onChange={handleChange}
								className={`w-full px-4 py-2 border rounded-lg ${
									errors.password ? "border-red-500" : "border-gray-300"
								}`}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-2 text-gray-500 hover:text-gray-700'>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
						{errors.password && (
							<p className='text-red-500 text-sm mt-1'>{errors.password}</p>
						)}
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full mb-2 bg-primaryColor text-white py-2 rounded-lg hover:bg-primaryColor/90 transition'>
						Sign In
          </button>
          <p className="text-center">Do not have an account? <Link className="text-primaryColor underline" to='/sign-up'>SignUp</Link> </p>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
