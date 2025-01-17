import { useState } from "react";
import { Link, useLocation,useNavigate} from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Avatar, Dropdown } from "flowbite-react";

const Navbar = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();
  const { user } = useSelector((state) => state.reducer.auth);
	// State to toggle the menu
	const [isOpen, setIsOpen] = useState(false);

	// Get the current path
	const location = useLocation();
	const currentPath = location.pathname;

	// Function to toggle the menu
	const toggleMenu = () => {
		setIsOpen((prev) => !prev);
	};

	// Check if the nav item is active
  const isActive = (path) => currentPath === path;
  
  const handleLogout = async() => {
		const shouldLogout = window.confirm("Are you sure you want to logout?");
		if (shouldLogout) {
			await dispatch(logout());
			navigate("/");
      setIsOpen(false);
		}
	};

	return (
		<section className='left-0 right-0 fixed z-30'>
			<div className='lg:px-[7rem] md:px-[5rem] px-5 shadow bg-white'>
				{/* For large screen */}
				<div className='lg:flex hidden items-center justify-between py-5 '>
					<div>
						<Link to='/' className='text-xl font-bold'>
							WALLET<span className='text-primaryColor'>APP</span>{" "}
						</Link>
					</div>

					{user && (
						<div className=''>
							<ul className='flex items-center gap-5'>
								<li>
									<Link
										className={`${
											isActive("/dashboard")
												? "bg-black text-white"
												: "hover:bg-black hover:text-white"
										} px-3 py-1 rounded-full`}
										to='/dashboard'>
										Dashboard
									</Link>
								</li>
								<li>
									<Link
										className={`${
											isActive("/transactions")
												? "bg-black text-white"
												: "hover:bg-black hover:text-white"
										} px-3 py-1 rounded-full`}
										to='/transactions'>
										Transactions
									</Link>
								</li>
								<li>
									<Link
										className={`${
											isActive("/categories")
												? "bg-black text-white"
												: "hover:bg-black hover:text-white"
										} px-3 py-1 rounded-full`}
										to='/categories'>
										Categories
									</Link>
								</li>
								<li>
									<Link
										className={`${
											isActive("/budgets")
												? "bg-black text-white"
												: "hover:bg-black hover:text-white"
										} px-3 py-1 rounded-full`}
										to='/budgets'>
										Budgets
									</Link>
								</li>
							</ul>
						</div>
					)}

					{user ? (
						<Dropdown
							label={<Avatar alt='User settings' rounded />}
							arrowIcon={false}
							inline>
							<Dropdown.Header>
								<span className='block text-sm'>
									{user?.firstname} {user?.lastname}
								</span>
								<span className='block truncate text-sm font-medium'>
									{user?.email}
								</span>
							</Dropdown.Header>
							<Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
						</Dropdown>
					) : (
						<div className='flex items-center gap-3'>
							<Link to='/sign-up' className='border px-2 py-1 rounded'>
								Sign Up
							</Link>
							Or
							<Link
								to='/sign-in'
								className='border px-2 py-1 rounded bg-primaryColor text-white'>
								Log In
							</Link>
						</div>
					)}
				</div>

				{/* For small screen */}
				<div className='lg:hidden bg-white'>
					<div className='flex items-center justify-between py-5'>
						<div>
							<Link to='/' className='text-xl font-bold'>
								WALLET<span className='text-primaryColor'>APP</span>{" "}
							</Link>
						</div>
						<div onClick={toggleMenu} className='cursor-pointer'>
							{/* Show menu or close icon based on `isOpen` */}
							{isOpen ? (
								<IoMdClose className='text-xl' />
							) : (
								<IoMenu className='text-xl' />
							)}
						</div>
					</div>

					{/* Show the menu only if `isOpen` is true */}
					{isOpen &&
						(user ? (
							<div className='bg-white'>
								<ul className='grid gap-1'>
									<li>
										<Link
											className={`${
												isActive("/dashboard")
													? "bg-black text-white"
													: "hover:bg-black hover:text-white"
											} block text-center px-3 py-1 rounded-full`}
											to='/dashboard'
											onClick={toggleMenu}>
											Dashboard
										</Link>
									</li>
									<li>
										<Link
											className={`${
												isActive("/transactions")
													? "bg-black text-white"
													: "hover:bg-black hover:text-white"
											} block text-center px-3 py-1 rounded-full`}
											to='/transactions'
											onClick={toggleMenu}>
											Transactions
										</Link>
									</li>
									<li>
										<Link
											className={`${
												isActive("/categories")
													? "bg-black text-white"
													: "hover:bg-black hover:text-white"
											} block text-center px-3 py-1 rounded-full`}
											to='/categories'
											onClick={toggleMenu}>
											Categories
										</Link>
									</li>
									<li>
										<Link
											className={`${
												isActive("/budgets")
													? "bg-black text-white"
													: "hover:bg-black hover:text-white"
											} block text-center px-3 py-1 rounded-full`}
											to='/budgets'
											onClick={toggleMenu}>
											Budgets
										</Link>
									</li>
									<li className='flex items-center justify-center gap-3'>
										<div className='flex items-center gap-2 py-3 justify-center'>
											<Avatar rounded className='cursor-pointer' />
											<p className='cursor-pointer'>
												{user?.firstname} {user?.lastname}
											</p>
										</div>
										<div>
											<button
												onClick={handleLogout}
												className='border px-2 py-1 rounded-lg bg-primaryColor text-white'>
												Log out
											</button>
										</div>
									</li>
								</ul>
							</div>
						) : (
							<div className='py-3 '>
								<ul>
									<li className='flex justify-center'>
										<Link
											onClick={toggleMenu}
											to='/sign-in'
											className='border px-5 py-2 rounded-full bg-primaryColor text-white '>
											Sign In
										</Link>
									</li>
									<p className='text-center'>Or</p>
									<li className='flex justify-center'>
										<Link
											onClick={toggleMenu}
											to='/sign-up'
											className='border px-5 py-2 rounded-full '>
											Sign Up
										</Link>
									</li>
								</ul>
							</div>
						))}
				</div>
			</div>
		</section>
	);
};

export default Navbar;
