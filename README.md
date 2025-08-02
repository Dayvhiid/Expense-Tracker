# Expense Tracker API

A RESTful API for tracking personal expenses built with Node.js, Express.js, MongoDB, and JWT authentication.

## Features

- **User Authentication**: Register, login, and secure JWT-based authentication
- **Expense Management**: Create, read, update, and delete expenses
- **Filtering & Search**: Filter expenses by category and date ranges
- **Data Validation**: Input validation and error handling
- **Secure**: Password hashing with bcrypt and protected routes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dayvhiid/Expense-Tracker.git
   cd Expense-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=4000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| PUT | `/api/auth/change-password` | Change user password | Private |

### Expenses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/expenses` | Create new expense | Private |
| GET | `/api/expenses` | Get all user expenses | Private |
| PATCH | `/api/expenses/:id` | Update expense | Private |
| DELETE | `/api/expenses/:id` | Delete expense | Private |

## API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Expense
```bash
POST /api/expenses
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "amount": 50.75,
  "description": "Weekly grocery shopping",
  "category": "Groceries"
}
```

### Get Expenses with Filters
```bash
# Get all expenses
GET /api/expenses
Authorization: Bearer <your_jwt_token>

# Filter by category
GET /api/expenses?category=Groceries
Authorization: Bearer <your_jwt_token>

# Filter by date range - past week
GET /api/expenses?filter=week
Authorization: Bearer <your_jwt_token>

# Filter by date range - past month
GET /api/expenses?filter=month
Authorization: Bearer <your_jwt_token>

# Filter by date range - past 3 months
GET /api/expenses?filter=3months
Authorization: Bearer <your_jwt_token>

# Custom date range
GET /api/expenses?filter=custom&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <your_jwt_token>

# Combine filters
GET /api/expenses?category=Utilities&filter=month
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10  // For list responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, min: 3 chars),
  email: String (required, unique, lowercase),
  password: String (required, min: 6 chars, hashed),
  createdAt: Date (default: now)
}
```

### Expense Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  amount: Number (required),
  description: String (required),
  category: String (required),
  date: Date (default: now)
}
```

## Available Categories

The seeder generates expenses with these categories:
- Groceries
- Transportation
- Utilities
- Entertainment
- Healthcare
- Dining Out
- Shopping
- Gas
- Insurance
- Internet

## Seeding Data

To populate your database with sample expense data:

```bash
npm run seed:expenses
```

This will generate 60-100 realistic expenses per user for the past 3 months.

## Project Structure

```
Expense-Tracker/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── expenseController.js   # Expense CRUD operations
├── middleware/
│   └── authMiddleware.js      # JWT authentication middleware
├── models/
│   ├── User.js               # User schema
│   └── Expense.js            # Expense schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── expenseRoutes.js      # Expense routes
├── seeders/
│   └── expenseSeeder.js      # Database seeder
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── index.js                 # Main server file
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port number | No (default: 4000) |

## Error Handling

The API includes comprehensive error handling for:
- Invalid user input
- Authentication failures
- Database connection issues
- Resource not found errors
- Server errors

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation and sanitization
- User-specific data access control

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed:expenses` - Seed database with sample expenses

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn


## License

This project is licensed under the ISC License.

## Contact

For questions or support, please contact the project maintainer.

---

*Happy expense tracking! 💰*
