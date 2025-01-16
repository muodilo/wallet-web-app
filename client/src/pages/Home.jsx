import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TfiWallet } from "react-icons/tfi";
import { FiBarChart2 } from "react-icons/fi";
import { FiPieChart } from "react-icons/fi";
import { MdOutlineInsights } from "react-icons/md";
import { Link } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();

    const { user, isSuccess} = useSelector(
			(state) => state.reducer.auth
  );
  
      useEffect(() => {


				//redirect when logged in
				if (isSuccess && user) {
					navigate(`/dashboard`);
				}

			}, [isSuccess, user]);

	return (
		<div className='relative lg:px-[7rem] md:px-[5rem] px-5 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden'>
			{/* Artistic Background Shapes */}
			<div className='absolute top-[-50px] left-[-100px] w-[300px] h-[300px] bg-primaryColor/10 rounded-full blur-3xl'></div>
			<div className='absolute bottom-[-70px] right-[-50px] w-[400px] h-[400px] bg-primaryColor/20 rounded-full blur-2xl'></div>

			<div className='grid md:grid-cols-2 grid-cols-1 gap-10 relative z-10'>
				{/* Left Section */}
				<div className='flex items-center h-svh'>
					<div>
						<h1 className='md:text-5xl text-3xl font-extrabold mb-5 md:text-left text-center'>
							Welcome to WalletApp
						</h1>
						<p className='text-xl mb-5 md:text-left text-center text-neutral-500'>
							Your all-in-one solution for personal finance management. Take
							control of your money with ease.
						</p>

						{/* Features */}
						<div className='grid grid-cols-2 gap-4 text-xl mb-7'>
							<div className='flex items-center gap-2'>
								<TfiWallet className='text-violet-500' />
								<p className='text-neutral-500'>Manage Budgets</p>
							</div>
							<div className='flex items-center gap-2'>
								<FiBarChart2 className='text-green-500' />
								<p className='text-neutral-500'>Track Expenses</p>
							</div>
							<div className='flex items-center gap-2'>
								<FiPieChart className='text-primaryColor' />
								<p className='text-neutral-500'>Budget Planning</p>
							</div>
							<div className='flex items-center gap-2'>
								<MdOutlineInsights className='text-yellow-500' />
								<p className='text-neutral-500'>Financial Insights</p>
							</div>
						</div>

						{/* CTA Button */}
						<div className='flex md:justify-start justify-center'>
							<Link
								to='/sign-in'
								className='w-full md:w-auto px-5 py-2 rounded-lg bg-primaryColor text-white text-center shadow-lg hover:shadow-xl transition-shadow duration-300'>
								Get started
							</Link>
						</div>
					</div>
				</div>

				{/* Right Section with Dashboard Screenshot */}
				<div className='h-svh md:flex items-center justify-center hidden'>
					<div className='relative w-full max-w-lg rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-100 rotate-6'>
						{/* Border mimicking a device */}
						<div className='relative border-8 border-gray-300 rounded-xl bg-white overflow-hidden'>
							<img
								src='https://www.justinmind.com/wp-content/webp-express/webp-images/uploads/2020/02/dahsboard-design-best-practices-example.png.webp'
								alt='Dashboard Screenshot'
								className='w-full h-full object-cover'
							/>
						</div>

						{/* Floating Badge */}
						<div className='absolute top-4 left-4 bg-primaryColor text-white text-sm font-semibold px-3 py-1 rounded-full shadow'>
							Dashboard Preview
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
