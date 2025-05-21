# Institute Management System (Backend)

The Institute Management System is a web application designed to manage various aspects of an educational institute, including student information, course management, and fee tracking.

## Features

- **Student Management**: Add, update, delete, and view student details.
- **Course Management**: Manage course information and enroll students in courses.
- **Fee Management**: Track and manage fee payments for students.
- **Authentication and Authorization**: Secure access to the system with user authentication and role-based authorization using JWT.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/institute-management-system.git
    cd institute-management-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### Student Endpoints

- **Add Student**: `POST /students`
- **Get All Students**: `GET /students`
- **Get Student By ID**: `GET /students/:studentId`
- **Update Student**: `PUT /students/:studentId`
- **Delete Student**: `DELETE /students/:studentId`

### Course Endpoints

- **Add Course**: `POST /courses`
- **Get All Courses**: `GET /courses`
- **Get Course By ID**: `GET /courses/:courseId`
- **Update Course**: `PUT /courses/:courseId`
- **Delete Course**: `DELETE /courses/:courseId`

### Fee Endpoints

- **Add Fee**: `POST /fees`
- **Get Payment History**: `GET /fees/history`
- **Get Fee By Course**: `GET /fees/course`

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary, Multer
- **Other**: Mongoose, dotenv

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
