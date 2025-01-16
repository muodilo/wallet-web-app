import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const register = async (userData) => {
	const response = await axios.post(`${API_URL}/users/register`, userData);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

const logout = async () => localStorage.removeItem("user");

const login = async (userData) => {
	const response = await axios.post(`${API_URL}/users/login`, userData);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}
	return response.data;
};

const authService = {
	register,
	logout,
	login,
};

export default authService;
