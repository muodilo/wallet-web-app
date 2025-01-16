import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/sign-up' element={<Signup />} />
				<Route path='/sign-in' element={<SignIn />} />
			</Routes>
			<Footer />
			<ToastContainer />
			
		</Router>
	);
}

export default App;