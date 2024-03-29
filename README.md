

# Authentication Project with MongoDB, Express.js, and Node.js

This project is a simple authentication system built using MongoDB for data storage and Express.js for handling server-side logic. It provides user registration, login, and logout functionalities.

## Live Demo

Check out the live demo [here](https://authentication-backend-lc49.onrender.com).

## Features

- User registration: Users can create an account by providing a unique username and password.
- User login: Registered users can log in using their credentials.
- User logout: Logged-in users can securely log out of their accounts.
- Password hashing: Passwords are securely hashed before being stored in the database for improved security.
- Session management: User sessions are managed using session cookies for authentication.
- User Profile update: Authorized users can update their profile information.


## Technologies Used

- MongoDB: A NoSQL database used for storing user data.
- Express.js: A web application framework for Node.js used for building the server-side logic.
- Node.js: A JavaScript runtime environment used for executing JavaScript code on the server.

## Installation

1. Clone the repository:

    ```
    git clone https://github.com/ESE-MONDAY/authentication-backend
    ```

2. Install dependencies:

    ```
    cd authentication
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following environment variables:

    ```
    PORT=3000
    MONGODB_URI=<mongodb-uri>
    TOKEN_KEY=<whateverkeyyoupick>
    ```

    Replace `<mongodb-uri>` with the URI of your MongoDB database and `<session-secret>` with a random string used for session encryption.

4. Start the server:

    ```
    npm start
    ```

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Register a new account by providing a unique username and password.
3. Log in using your credentials.
4. Perform authenticated actions such as viewing user-specific content.
5. Log out when you're done.

## Postman Collection

Explore the API endpoints and test the functionality using the [Postman collection documentation](https://documenter.getpostman.com/view/10964379/2sA2xpS9U2).


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize this README template according to your project's specific features, requirements, and preferences.
