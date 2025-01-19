import  { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useGet } from "../hooks/useGet";
import { useSelector } from "react-redux";

const chartSetting = {
	yAxis: [
		{
			label: "Income/Expense",
		},
	],
	width: 300, // Adjusted width for a smaller chart
	height: 250, // Adjusted height for a smaller chart
	sx: {
		[`.${axisClasses.left} .${axisClasses.label}`]: {
			transform: "translate(-20px, 0)",
		},
	},
};

export default function BarChartView() {
	const [period, setPeriod] = useState("month"); // Default to 'week'
	const { user } = useSelector((state) => state.reducer.auth);
	const token = user?.token;
	const API_URL = import.meta.env.VITE_API_URL;

	// Fetch data dynamically based on the selected period
	const { data, error, isLoading } = useGet(
		`${API_URL}/transactions/bar-chart?period=${period}`,
		token,
		5000
	);

	// Transform data into the required format for BarChart
	const dataset = Array.isArray(data)
		? data.map((entry) => {
				const label = Object.keys(entry)[0]; // 'Monday', 'Day 1', etc.
				const { income = 0, expense = 0 } = entry[label] || {};
				return { label, income, expense };
		})
		: [];

	// Loading and error states
	if (isLoading)
		return (
			<div className='flex justify-center items-center h-60'>
				<div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent'></div>
			</div>
		);
	if (error)
		return (
			<div className='flex justify-center items-center h-60 text-red-500'>
				Error: {error.message || "Failed to load data."}
			</div>
		);

	return (
		<div className='max-w-md mx-auto  rounded-lg p-4 space-y-4 '>
			{/* Dropdown Selector */}
			<div className='flex items-center justify-between'>
				<h2 className='text-base font-medium text-gray-800'>
					Bar Chart Overview
				</h2>
				<div className='flex items-center space-x-3'>
					<label htmlFor='period-select' className='text-sm text-gray-600'>
						Period:
					</label>
					<select
						id='period-select'
						className='p-2 border rounded bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={period}
						onChange={(e) => setPeriod(e.target.value)}>
						{/* <option value='week'>This Week</option> */}
						<option value='month'>This Month</option>
						<option value='year'>This Year</option>
					</select>
				</div>
			</div>

			{/* Bar Chart */}
			<div className='flex justify-center overflow-x-auto'>
				<BarChart
					dataset={dataset}
					xAxis={[{ scaleType: "band", dataKey: "label" }]}
					series={[
						{
							dataKey: "income",
							label: "Income",
							valueFormatter: (v) => `Rwf${v}`,
						},
						{
							dataKey: "expense",
							label: "Expense",
							valueFormatter: (v) => `Rwf${v}`,
						},
					]}
					{...chartSetting}
				/>
			</div>
		</div>
	);
}
