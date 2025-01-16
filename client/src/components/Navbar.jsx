import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
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
					<div className='flex items-center gap-3'>
						<Link to='/sign-up' className='border px-2 py-1 rounded'>Sign Up</Link>
						Or
						<Link to='/sign-in' className='border px-2 py-1 rounded bg-primaryColor text-white'>
							Log In
						</Link>
					</div>
				</div>

				{/* For small screen */}
				<div className='lg:hidden bg-white'>
					<div className='flex items-center justify-between py-5'>
						<div>
							<h2 className='text-xl font-bold'>
								WALLET<span className='text-primaryColor'>APP</span>{" "}
							</h2>
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
					{isOpen && (
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
							</ul>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Navbar;
