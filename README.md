# Wallet Web Application

## Overview
A wallet web application designed to help users track income, expenses, and budgets across multiple accounts (e.g., bank, mobile money, cash). It allows generating  report, visualizing data, and setting budgets with alerts when exceeded.

## Features
- **Transaction Tracking**: Track all income and expense transactions.
- **Category Management**: Add categories and subcategories for better organization.
- **Budget Alerts**: Notify users when their spending exceeds the set budget.
- **Reports**: Generate report.
- **Visualization**: Display data through charts and graphs for better insights.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **Visualization**: mui/x-charts

## Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Git
- A package manager (npm or yarn)

## How to Start
1. Clone the repository:
   ```bash
   git clone https://github.com/muodilo/wallet-web-app.git

## env
1. FrontEnd
-VITE_API_URL="http://localhost:5000/api/v1" 
2. Backend
-MONGO_URI="your-mongo-uri"  # Replace with your MongoDB connection string
-JWT_SECRET="your-secret-key"  # Replace with your JWT secret





## Deployed Link
- **Frontend**: [View the live site here!](https://wallet-web-app-weld.vercel.app/)
- **API**: [Swagger API Documentation](https://wallet-web-app.onrender.com/api-docs/#)

