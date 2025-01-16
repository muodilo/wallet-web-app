import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import {register,resetUser} from '../features/auth/authSlice'

const Signup = () => {
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
  });
  
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
		(state) => state.reducer.auth
  );
  
  useEffect(() => {
		if (isError) {
			toast.error(message);
		}

		//redirect when logged in
		if (isSuccess && user) {
			navigate("/dashboard");
		}

		dispatch(resetUser());
	}, [isError, isSuccess, user, message, dispatch]);

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	// Handle input change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Form validation
	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstname.trim())
			newErrors.firstname = "First name is required.";
		if (!formData.lastname.trim())
			newErrors.lastname = "Last name is required.";
		if (!formData.email.trim()) newErrors.email = "Email is required.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
			newErrors.email = "Invalid email format.";
		if (!formData.password.trim()) newErrors.password = "Password is required.";
		else if (formData.password.length < 6)
			newErrors.password = "Password must be at least 6 characters.";
		if (formData.confirmPassword !== formData.password)
			newErrors.confirmPassword = "Passwords do not match.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0; // Return true if no errors
	};

	// Form submission
	const handleSubmit = async(e) => {
		e.preventDefault();
    if (validateForm()) {
      
      try {
         await dispatch(register(formData));
        console.log("Form Submitted:", formData);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        toast.error(error);
      }
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='w-full max-w-md  p-8 rounded-lg '>
				<h2 className='text-2xl font-bold text-center mb-6'>
					Create an Account
				</h2>
				<form onSubmit={handleSubmit}>
					{/* First Name */}
					<div className='mb-4'>
						<label className='block text-gray-700 font-semibold mb-1'>
							First Name
						</label>
						<input
							type='text'
							name='firstname'
							value={formData.firstname}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg ${
								errors.firstname ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.firstName && (
							<p className='text-red-500 text-sm mt-1'>{errors.firstname}</p>
						)}
					</div>

					{/* Last Name */}
					<div className='mb-4'>
						<label className='block text-gray-700 font-semibold mb-1'>
							Last Name
						</label>
						<input
							type='text'
							name='lastname'
							value={formData.lastname}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg ${
								errors.lastName ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.lastName && (
							<p className='text-red-500 text-sm mt-1'>{errors.lastname}</p>
						)}
					</div>

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

					{/* Confirm Password */}
					<div className='mb-4'>
						<label className='block text-gray-700 font-semibold mb-1'>
							Confirm Password
						</label>
						<input
							type={showPassword ? "text" : "password"}
							name='confirmPassword'
							value={formData.confirmPassword}
							onChange={handleChange}
							className={`w-full px-4 py-2 border rounded-lg ${
								errors.confirmPassword ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.confirmPassword && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.confirmPassword}
							</p>
						)}
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full mb-2 bg-primaryColor text-white py-2 rounded-lg hover:bg-primaryColor/90 transition'>
						{isLoading ? "Singing Up..." : "Sign Up"}
					</button>
					<p className='text-center'>
						Already have an account{" "}
						<Link className='text-primaryColor underline ' to='/sign-in'>
							Log In
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Signup;
