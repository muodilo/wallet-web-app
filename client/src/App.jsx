import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AccountsList from "./pages/AccountsList";
import CategoriesPage from "./pages/CategoriesPage";
import BudgetListPage from "./pages/BudgetListpage";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/sign-up' element={<Signup />} />
				<Route path='/sign-in' element={<SignIn />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/transactions' element={<Transactions />} />
				<Route path='/accounts' element={<AccountsList />} />
				<Route path='/categories' element={<CategoriesPage />} />
				<Route path='/budgets' element={<BudgetListPage />} />
			</Routes>
			<Footer />
			<ToastContainer />
		</Router>
	);
}

export default App;