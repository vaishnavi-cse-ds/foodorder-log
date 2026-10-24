🍽️ Food Order Log

Track your cravings. Manage your orders. Keep your food expenses organized.

🍽️ Ready to explore?

👉 "VISIT FOOD ORDER LOG" (https://foodorder-log.vercel.app/)

🔗 🚀 Live Demo: "Open Food Order Log" (https://foodorder-log.vercel.app/)

«Explore the live application and manage your food orders directly from your browser!»

---

🌟 About the Project

Food Order Log is a web application designed to help users record, organize, and manage their food orders in one place. It provides a simple, visually appealing interface for tracking restaurant orders, monitoring bills, and managing order details.

Whether you're ordering biryani, pizza, noodles, or desserts, Food Order Log helps you keep track of your food expenses effortlessly.

✨ Features

- 🍕 Food Menu: Explore a variety of dishes from different cuisines.
- ➕ Add Orders: Record food orders with restaurant or dish name, bill amount, cuisine, delivery status, and order date.
- ✏️ Edit Orders: Update existing order details whenever needed.
- 🗑️ Delete Orders: Remove orders you no longer need.
- 🔍 Cuisine Filtering: Filter orders based on cuisine.
- 💰 Bill Sorting: Sort orders by bill amount.
- 📊 Expense Overview: View order statistics and total spending.
- 🖼️ Food Images: Enjoy a visual interface with food images.
- 📱 Responsive Design: Access the application from supported desktop and mobile browsers.
- ☁️ Online Deployment: Access the application through its public URL.

🚀 Try It Now

👉 "OPEN THE LIVE APPLICATION" (https://foodorder-log.vercel.app/)

No local installation is needed to explore the deployed website.

🛠️ Tech Stack

Technology| Purpose
React| Frontend user interface
Vite| Frontend development and build tool
Node.js| Backend runtime
Express.js| REST API
MongoDB| Database for storing food orders
Mongoose| MongoDB object modeling
Vercel| Frontend deployment
Render| Backend deployment

🏗️ Project Architecture

Food Order Log
      |
      v
React + Vite Frontend
      |
      v
Express.js REST API
      |
      v
MongoDB Database

The frontend communicates with the backend API to create, retrieve, update, and delete food orders.

📂 Project Structure

foodorder-log/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    └── package.json

The directory structure may vary slightly depending on the current repository layout.

⚙️ Run Locally

Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Git

1. Clone the repository

git clone https://github.com/vaishnavi-cse-ds/foodorder-log.git
cd foodorder-log

2. Start the backend

Open a terminal in the backend directory:

cd backend
npm install

Configure the required environment variables, including your MongoDB connection string and port, using the variable names expected by your backend.

Start the backend:

node server.js

3. Start the frontend

Open another terminal in the frontend directory:

cd frontend
npm install

Create a ".env" file in the frontend directory with your local API address:

VITE_API_URL=http://localhost:3000

Start the development server:

npm run dev

Open the local URL displayed in your terminal.

Note: Never commit database credentials, API secrets, or ".env" files containing sensitive values to GitHub.

🎯 Project Goals

- Simplify food order tracking.
- Help users monitor their food expenses.
- Demonstrate full-stack web development.
- Practice REST API integration and database operations.
- Provide an accessible, user-friendly application.
