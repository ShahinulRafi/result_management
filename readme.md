# Project Name: Result Management System

## Description

This project is a Result Management System built using Node.js, Express.js, React.js and VITE. It provides functionalities for user registration, login, user information retrieval, managing student information, managing committees, assigning courses to teachers, managing course information, inserting and retrieving course results, and managing sessional viva results.

## Features

- User Registration and Authentication
- User Management (Admin)
- Student Management (Admin)
- Committee Management (Admin)
- Course Management (Admin)
- Result Management
- Sessional Viva Result Management

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`
4. Set up MySQL database and configure the connection in `server.js`
5. Run the application: `npm run server`

## Usage

1. Register users using the `/server/registration` endpoint.
2. Login using the `/server/login` endpoint to obtain a JWT token.
3. Use the obtained token to access protected endpoints.
4. Utilize various endpoints for managing users, students, committees, courses, and results as described in the API documentation below.

## API Documentation

The API endpoints and their functionalities are as follows:

1. `/server/registration`
2. `/server/registrationBulk`
3. `/server/login`
4. `/server/userInfoByToken`
5. `/admin/allUsers`
6. `/admin/updateUser`
7. `/admin/deleteUser`
8. `/admin/insertStudent`
9. `/admin/insertBulkStudents`
10. `/admin/updateStudent`
11. `/admin/deleteStudent`
12. `/admin/allStudents`
13. `/admin/allStudentsBySession`
14. `/admin/insertCommittee`
15. `/admin/insertCommitteeMember`
16. `/admin/allCommittees`
17. `/admin/committeeInformationById`
18. `/admin/deleteCommittee`
19. `/admin/deleteCommitteeMember`
20. `/admin/insertAssignCourseTeacher`
21. `/admin/deleteAssignCourseTeacher`
22. `/admin/allAssignCoursesByTeacher`
23. `/admin/insertCourse`
24. `/admin/updateCourse`
25. `/admin/deleteCourse`
26. `/admin/allCourses`
27. `/admin/allCoursesBySession`
28. `/server/insertCourseResults`
29. `/server/allResultsByCourse`
30. `/server/allResultsBySession`
31. `/server/allResultsByStudent`
32. `/server/insertSessionalVivaResults`
33. `/server/allSessionalVivaResultsByStudent`
34. `/server/allSessionalVivaResultsBySession`

Below is the API documentation for all the provided endpoints:

---

### User Registration and Authentication

#### 1. Register a User

- **Endpoint:** `/server/registration`
  - **Method:** POST
  - **Description:** Registers a single user.
  - **Request Body Format:**
    ```json
    {
      "userId": "string",
      "password": "string",
      "full_name": "string",
      "is_external": "boolean",
      "email": "string",
      "phone": "string",
      "role": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 2. Register Multiple Users in Bulk

- **Endpoint:** `/server/registrationBulk`
  - **Method:** POST
  - **Description:** Registers multiple users in bulk.
  - **Request Body Format:**
    ```json
    {
      "users": "[Array of user objects]"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 3. User Login

- **Endpoint:** `/server/login`
  - **Method:** POST
  - **Description:** Authenticates a user and provides a JWT token for authorization.
  - **Request Body Format:**
    ```json
    {
      "userId": "string",
      "password": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "token": "string"
    }
    ```

#### 4. Get User Information by Token

- **Endpoint:** `/server/userInfoByToken`
  - **Method:** POST
  - **Description:** Retrieves user information using a JWT token.
  - **Request Header:**
    ```
    Authorization: Bearer <token>
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "user": "user object"
    }
    ```

### Admin Operations

#### 5. Get All Users

- **Endpoint:** `/admin/allUsers`
  - **Method:** POST
  - **Description:** Retrieves all user information.
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "users": "[Array of user objects]"
    }
    ```

#### 6. Update User Information

- **Endpoint:** `/admin/updateUser`
  - **Method:** PUT
  - **Description:** Updates user information.
  - **Request Body Format:**
    ```json
    {
      "userId": "string",
      "updatedFields": "object"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 7. Delete User

- **Endpoint:** `/admin/deleteUser`
  - **Method:** DELETE
  - **Description:** Deletes a user.
  - **Request Parameter:**
    ```
    userId: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 8. Insert Student

- **Endpoint:** `/admin/insertStudent`
  - **Method:** POST
  - **Description:** Inserts a student.
  - **Request Body Format:**
    ```json
    {
      "studentId": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "session": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 9. Insert Multiple Students in Bulk

- **Endpoint:** `/admin/insertBulkStudents`
  - **Method:** POST
  - **Description:** Inserts multiple students in bulk.
  - **Request Body Format:**
    ```json
    {
      "students": "[Array of student objects]"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 10. Update Student Information

- **Endpoint:** `/admin/updateStudent`
  - **Method:** PUT
  - **Description:** Updates student information.
  - **Request Body Format:**
    ```json
    {
      "studentId": "string",
      "updatedFields": "object"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 11. Delete Student

- **Endpoint:** `/admin/deleteStudent`
  - **Method:** DELETE
  - **Description:** Deletes a student.
  - **Request Parameter:**
    ```
    studentId: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 12. Get All Students

- **Endpoint:** `/admin/allStudents`
  - **Method:** POST
  - **Description:** Retrieves information about all students.
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "students": "[Array of student objects]"
    }
    ```

#### 13. Get All Students by Session

- **Endpoint:** `/admin/allStudentsBySession`
  - **Method:** POST
  - **Description:** Retrieves information about all students belonging to a specific session.
  - **Request Parameter:**
    ```
    session: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "students": "[Array of student objects]"
    }
    ```

#### 14. Insert Committee

- **Endpoint:** `/admin/insertCommittee`
  - **Method:** POST
  - **Description:** Inserts a committee.
  - **Request Body Format:**
    ```json
    {
      "committeeId": "string",
      "name": "string",
      "description": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 15. Insert Committee Member

- **Endpoint:** `/admin/insertCommitteeMember`
  - **Method:** POST
  - **Description:** Adds a member to a committee.
  - **Request Body Format:**
    ```json
    {
      "committeeId": "string",
      "memberId": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 16. Get All Committees

- **Endpoint:** `/admin/allCommittees`
  - **Method:** POST
  - **Description:** Retrieves information about all committees.
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "committees": "[Array of committee objects]"
    }
    ```

#### 17. Get Committee Information by ID

- **Endpoint:** `/admin/committeeInformationById`
  - **Method:** POST
  - **Description:** Retrieves information about a committee by its ID.
  - **Request Parameter:**
    ```
    committeeId: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "committee": "committee object"
    }
    ```

#### 18. Delete Committee

- **Endpoint:** `/admin/deleteCommittee`
  - **Method:** DELETE
  - **Description:** Deletes a committee.
  - **Request Parameter:**
    ```
    committeeId: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 19. Delete Committee Member

- **Endpoint:** `/admin/deleteCommitteeMember`
  - **Method:** DELETE
  - **Description:** Removes a member from a committee.
  - **Request Body Format:**
    ```json
    {
      "committeeId": "string",
      "memberId": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 20. Insert Assign Course Teacher

- **Endpoint:** `/admin/insertAssignCourseTeacher`
  - **Method:** POST
  - **Description:** Assigns a teacher to a course.
  - **Request Body Format:**
    ```json
    {
      "courseId": "string",
      "teacherId": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 21. Delete Assign Course Teacher

- **Endpoint:** `/admin/deleteAssignCourseTeacher`
  - **Method:** DELETE
  - **Description:** Removes a teacher assignment from a course.
  - **Request Body Format:**
    ```json
    {
      "courseId": "string",
      "teacherId": "string"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 22. Get All Assigned Courses by Teacher

- **Endpoint:** `/admin/allAssignCoursesByTeacher`
  - **Method:** POST
  - **Description:** Retrieves all courses assigned to a particular teacher.
  - **Request Parameter:**
    ```
    teacherId: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "courses": "[Array of course objects]"
    }
    ```

#### 23. Insert Course

- **Endpoint:** `/admin/insertCourse`
  - **Method:** POST
  - **Description:** Adds a new course to the system.
  - **Request Body Format:**
    ```json
    {
      "name": "string",
      "code": "string",
      "credit": "number"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 24. Update Course

- **Endpoint:** `/admin/updateCourse`
  - **Method:** PUT
  - **Description:** Updates information about a course.
  - **Request Body Format:**
    ```json
    {
      "courseId": "string",
      "name": "string",
      "code": "string",
      "credit": "number"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 25. Delete Course

- **Endpoint:** `/admin/deleteCourse`
  - **Method:** DELETE
  - **Description:** Deletes a course from the system.
  - **Request Parameter:**
    ```
    courseId: string
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 26. Get All Courses

- **Endpoint:** `/admin/allCourses`
  - **Method:** POST
  - **Description:** Retrieves information about all courses in the system.
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "courses": "[Array of course objects]"
    }
    ```

#### 27. Get All Courses by Session

- **Endpoint:** `/admin/allCoursesBySession`
  - **Method:** POST
  - **Description:** Retrieves all courses offered in a particular session.
  - **Request Parameter:**
    ```
    session: "string"
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "courses": "[Array of course objects]"
    }
    ```

#### 28. Insert Course Results

- **Endpoint:** `/server/insertCourseResults`
  - **Method:** POST
  - **Description:** Inserts course results for students.
  - **Request Body Format:**
    ```json
    {
      "courseId": "string",
      "session": "string",
      "results": "[Array of result objects]"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 29. Get All Results by Course

- **Endpoint:** `/server/allResultsByCourse`
  - **Method:** POST
  - **Description:** Retrieves all results for a particular course.
  - **Request Parameter:**
    ```
    courseId: "string"
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "results": "[Array of result objects]"
    }
    ```

#### 30. Get All Results by Session

- **Endpoint:** `/server/allResultsBySession`
  - **Method:** POST
  - **Description:** Retrieves all results for a particular session.
  - **Request Parameter:**
    ```
    session: "string"
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "results": "[Array of result objects]"
    }
    ```

#### 31. Get All Results by Student

- **Endpoint:** `/server/allResultsByStudent`
  - **Method:** POST
  - **Description:** Retrieves all results for a particular student.
  - **Request Parameter:**
    ```
    studentId: "string"
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "results": "[Array of result objects]"
    }
    ```

#### 32. Insert Sessional Viva Results

- **Endpoint:** `/server/insertSessionalVivaResults`
  - **Method:** POST
  - **Description:** Inserts sessional viva results for students.
  - **Request Body Format:**
    ```json
    {
      "session": "string",
      "results": "[Array of result objects]"
    }
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "message": "string"
    }
    ```

#### 33. Get All Sessional Viva Results by Student

- **Endpoint:** `/server/allSessionalVivaResultsByStudent`
  - **Method:** POST
  - **Description:** Retrieves all sessional viva results for a particular student.
  - **Request Parameter:**
    ```
    studentId: "string"
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "results": "[Array of result objects]"
    }
    ```

#### 34. Get All Sessional Viva Results by Session

- **Endpoint:** `/server/allSessionalVivaResultsBySession`
  - **Method:** POST
  - **Description:** Retrieves all sessional viva results for a particular session.
  - **Request Parameter:**
    ```
    session: "string"
    ```
  - **Response Format:**
    ```json
    {
      "ok": "boolean",
      "results": "[Array of result objects]"
    }
    ```
