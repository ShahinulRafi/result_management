const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5000;

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "result_management_db",
});

// Secret key for JWT
const JWT_SECRET_KEY = "youCantCrackThis";

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routes

// Login Registration and User Information Start

// single user registration
app.post("/server/registration", (req, res) => {
  const { userId, password, full_name, is_external, email, phone, role } =
    req.body;
  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert user information into the database
  const query = `INSERT INTO user_information (userId, full_name, is_external, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [userId, full_name, is_external, email, phone, role],
    (err, result) => {
      if (err) {
        console.error("Error registering user: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ ok: false, message: "User already exists" });
          return;
        }
        return;
      } else {
        // Insert user credentials into the database
        db.query(
          `INSERT INTO users (userId, password) VALUES (?, ?)`,
          [userId, hashedPassword],
          (err, result) => {
            if (err) {
              console.error("Error registering user: ", err);
              res.json({ ok: true, message: "Error registering user" });
              return;
            }
            res.json({ ok: true, message: "User registered successfully" });
          }
        );
      }
    }
  );
});

// bulk user registration with password
app.post("/server/registrationBulk", (req, res) => {
  // allUsers is an array of objects containing userId, full_name, is_external, email, phone, role  and password
  const { allUsers } = req.body;
  const valuesData = allUsers.map((user) => [
    user.userId,
    user.full_name,
    user.is_external,
    user.email,
    user.phone,
    JSON.stringify(user.role.split(",").map((item) => item.trim())),
  ]);

  const placeholders = valuesData.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
  const flattenedValues = valuesData.reduce((acc, val) => acc.concat(val), []);

  db.query(
    `INSERT INTO user_information (userId, full_name, is_external, email, phone, role) VALUES ${placeholders}`,
    flattenedValues,
    (err, result) => {
      if (err) {
        console.error("Error registering users: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ ok: false, message: "User already exists" });
          return;
        }
        return;
      } else {
        // Insert user credentials into the database
        const valuesData = allUsers.map((user) => [
          user.userId,
          bcrypt.hashSync(user.password, 10),
        ]);
        const placeholders = valuesData.map(() => "(?, ?)").join(", ");
        const flattenedValues = valuesData.reduce(
          (acc, val) => acc.concat(val),
          []
        );

        db.query(
          `INSERT INTO users (userId, password) VALUES ${placeholders}`,
          flattenedValues,
          (err, result) => {
            if (err) {
              console.error("Error registering users: ", err);
              res.json({ ok: true, message: "Error registering users" });
              return;
            }
            res.json({ ok: true, message: "Users registered successfully" });
          }
        );
      }
    }
  );
});

// user login with jws token

app.post("/server/login", (req, res) => {
  const { userId, password } = req.body;

  // Get user information from the database
  db.query(`SELECT * FROM users WHERE userId = ?`, [userId], (err, result) => {
    if (err) {
      console.error("Error logging in: ", err);
      res.json({ ok: false, message: "Error logging in" });
      return;
    }

    if (result.length === 0) {
      res.json({ ok: false, message: "User not found" });
      return;
    }

    const user = result[0];

    // Compare the password
    if (bcrypt.compareSync(password, user.password)) {
      // Generate JWT token
      const token = jwt.sign({ userId: user.userId }, JWT_SECRET_KEY, {
        expiresIn: "7D",
      }); // Adjust token expiration as needed

      // Send token as response
      res.json({ ok: true, token: token });
    } else {
      res.json({ ok: false, message: "Invalid credentials" });
    }
  });
});

// Get user information by token
app.post("/server/userInfoByToken", (req, res) => {
  const token = req.body?.token;
  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  db.query(
    `SELECT * FROM user_information WHERE userId = ?`,
    [decoded.userId],
    (err, result) => {
      if (err) {
        console.error("Error getting user information: ", err);
        res.json({ ok: false, message: "Error getting user information" });
        return;
      }

      if (result.length === 0) {
        res.json({ ok: false, message: "User not found" });
        return;
      }
      const user = result[0];
      res.json({ ok: true, message: user });
    }
  );
});

// Login Registration and User Information End

// Admin Section Start
// Get all user information
app.post("/admin/allUsers", (req, res) => {
  db.query(`SELECT * FROM user_information`, (err, result) => {
    if (err) {
      console.error("Error getting users: ", err);
      res.json({ ok: false, message: "Error getting users" });
      return;
    }
    res.json({ ok: true, message: result });
  });
});

// Get all user information by Single role
app.post("/admin/allUsersBySingleRole", (req, res) => {
  const { singleRole } = req.body;

  db.query(
    `SELECT * FROM user_information WHERE JSON_CONTAINS(role, JSON_ARRAY(?))`,
    [singleRole],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        res.json({ ok: false, message: "Error getting users" });
      } else {
        res.json({ ok: true, message: result });
      }
    }
  );
});

// Update user information by userId
app.post("/admin/updateUser", (req, res) => {
  const { userId, full_name, is_external, email, phone, role } = req.body;
  db.query(
    `UPDATE user_information SET full_name = ?, is_external = ?, email = ?, phone = ?, role = ? WHERE userId = ?`,
    [full_name, is_external, email, phone, role, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user: ", err);
        res.json({ ok: false, message: "Error updating user" });
        return;
      }
      res.json({ ok: true, message: "User updated successfully" });
    }
  );
});

// Delete user by userId
app.post("/admin/deleteUser", (req, res) => {
  const { userId } = req.body;
  db.query(
    `DELETE FROM user_information WHERE userId = ?`,
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error deleting user: ", err);
        res.json({ ok: false, message: "Error deleting user" });
        return;
      }
      res.json({ ok: true, message: "User deleted successfully" });
    }
  );
});

// Insert Student Information
app.post("/admin/insertStudent", (req, res) => {
  const { student_id, full_name, session } = req.body;
  db.query(
    `INSERT INTO students (student_id, full_name, session) VALUES (?, ?, ?)`,
    [student_id, full_name, session],
    (err, result) => {
      if (err) {
        console.error("Error inserting student: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ ok: false, message: "Student already exists" });
          return;
        } else {
          res.json({ ok: false, message: "Error inserting student" });
          return;
        }
      }
      res.json({ ok: true, message: "Student inserted successfully" });
    }
  );
});

// Insert Bulk Student Information
app.post("/admin/insertBulkStudents", (req, res) => {
  // allStudents is an array of objects containing student_id, full_name, session
  const { allStudents } = req.body;
  const valuesData = allStudents.map((student) => [
    student.student_id,
    student.full_name,
    student.session,
  ]);

  const placeholders = valuesData.map(() => "(?, ?, ?)").join(", ");
  const flattenedValues = valuesData.reduce((acc, val) => acc.concat(val), []);

  db.query(
    `INSERT INTO students (student_id, full_name, session) VALUES ${placeholders}`,
    flattenedValues,
    (err, result) => {
      if (err) {
        console.error("Error inserting students: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ ok: false, message: "Student already exists" });
          return;
        } else {
          res.json({ ok: false, message: "Error inserting students" });
          return;
        }
      }
      res.json({ ok: true, message: "Students inserted successfully" });
    }
  );
});

// Update Student Information by student_id
app.post("/admin/updateStudent", (req, res) => {
  const { student_id, full_name, session } = req.body;
  db.query(
    `UPDATE students SET full_name = ?, session = ? WHERE student_id = ?`,
    [full_name, session, student_id],
    (err, result) => {
      if (err) {
        console.error("Error updating student: ", err);
        res.json({ ok: false, message: "Error updating student" });
        return;
      }
      res.json({ ok: true, message: "Student updated successfully" });
    }
  );
});

// Delete student by student_id
app.post("/admin/deleteStudent", (req, res) => {
  const { student_id } = req.body;
  db.query(
    `DELETE FROM students WHERE student_id = ?`,
    [student_id],
    (err, result) => {
      if (err) {
        console.error("Error deleting student: ", err);
        res.json({ ok: false, message: "Error deleting student" });
        return;
      }
      res.json({ ok: true, message: "Student deleted successfully" });
    }
  );
});

// Get all students List
app.post("/admin/allStudents", (req, res) => {
  db.query(`SELECT * FROM students`, (err, result) => {
    if (err) {
      console.error("Error getting students: ", err);
      res.json({ ok: false, message: "Error getting students" });
      return;
    }
    res.json({ ok: true, message: result });
  });
});

// Get all students List by session
app.post("/admin/allStudentsBySession", (req, res) => {
  const { session } = req.body;
  db.query(
    `SELECT * FROM students WHERE session = ?`,
    [session],
    (err, result) => {
      if (err) {
        console.error("Error getting students: ", err);
        res.json({ ok: false, message: "Error getting students" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Insert Committee Information
app.post("/admin/insertCommittee", (req, res) => {
  // committee_chairman is the userId of a user
  const { committee_id, committee_name, committee_chairman, session } =
    req.body;
  db.query(
    `INSERT INTO committees (committee_id, committee_name, committee_chairman, session) VALUES (?, ?, ?, ?)`,
    [committee_id, committee_name, committee_chairman, session],
    (err, result) => {
      if (err) {
        console.error("Error inserting committee: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ ok: false, message: "Committee already exists" });
          return;
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          res.json({ ok: false, message: "Chairman does not exist" });
          return;
        } else {
          res.json({ ok: false, message: "Error inserting committee" });
          return;
        }
      }
      res.json({ ok: true, message: "Committee inserted successfully" });
    }
  );
});

// Insert Committee Members
app.post("/admin/insertCommitteeMember", (req, res) => {
  // member is a userId
  const { committee_id, member } = req.body;

  db.query(
    `INSERT INTO committee_members (committee_id, member) VALUES (?, ?)`,
    [committee_id, member],
    (err, result) => {
      if (err) {
        console.error("Error inserting committee member: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({
            ok: false,
            message: "Member already exists in this committee",
          });
          return;
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          res.json({
            ok: false,
            message: "Member OR Committee does not exist",
          });
          return;
        } else {
          res.json({ ok: false, message: "Error inserting committee member" });
          return;
        }
      }
      res.json({ ok: true, message: "Committee member inserted successfully" });
    }
  );
});

// Get all committees List
app.post("/admin/allCommittees", (req, res) => {
  db.query(`SELECT * FROM committees`, (err, result) => {
    if (err) {
      console.error("Error getting committees: ", err);
      res.json({ ok: false, message: "Error getting committees" });
      return;
    }
    res.json({ ok: true, message: result });
  });
});

// Get committee information by committee_id
app.post("/admin/committeeInformationById", (req, res) => {
  const { committee_id } = req.body;
  db.query(
    `SELECT cm.*, user.* FROM committee_members cm 
    JOIN user_information user ON cm.member = user.userId 
    WHERE cm.committee_id = ?
    `,
    [committee_id],
    (err, result) => {
      if (err) {
        console.error("Error getting committee members: ", err);
        res.json({ ok: false, message: "Error getting committee members" });
        return;
      }

      const committeeMembers = result.map((member) => {
        return {
          member: member.member,
          full_name: member.full_name,
          is_external: member.is_external,
          email: member.email,
          phone: member.phone,
          role: member.role,
        };
      });

      db.query(
        `SELECT * FROM committees c JOIN user_information u ON c.committee_chairman = u.userId WHERE c.committee_id = ?`,
        [committee_id],
        (err, result) => {
          if (err) {
            console.error("Error getting committee: ", err);
            res.json({ ok: false, message: "Error getting committee" });
            return;
          }

          const committee = {
            committee_id: result[0].committee_id,
            committee_name: result[0].committee_name,
            committee_chairman: result[0].full_name,
            session: result[0].session,
            members: committeeMembers,
          };

          res.json({ ok: true, message: committee });
        }
      );
    }
  );
});

// Delete Committee by committee_id
app.post("/admin/deleteCommittee", (req, res) => {
  const { committee_id } = req.body;
  db.query(
    `DELETE FROM committees WHERE committee_id = ?`,
    [committee_id],
    (err, result) => {
      if (err) {
        console.error("Error deleting committee: ", err);
        res.json({ ok: false, message: "Error deleting committee" });
        return;
      }
      res.json({ ok: true, message: "Committee deleted successfully" });
    }
  );
});

// Delete Committee Member by committee_id and member
app.post("/admin/deleteCommitteeMember", (req, res) => {
  // member is the userId of a user
  const { committee_id, member } = req.body;
  db.query(
    `DELETE FROM committee_members WHERE committee_id = ? AND member = ?`,
    [committee_id, member],
    (err, result) => {
      if (err) {
        console.error("Error deleting committee member: ", err);
        res.json({ ok: false, message: "Error deleting committee member" });
        return;
      }
      res.json({ ok: true, message: "Committee member deleted successfully" });
    }
  );
});

// Get committee List by user_id
app.post("/admin/committeeListByUser", (req, res) => {
  const { user_id } = req.body;
  db.query(
    `SELECT DISTINCT cm.committee_id, cm.committee_name, cm.session,
    CASE 
      WHEN cm.committee_chairman = ? THEN 'Chairman'
      ELSE 'Member' 
    END AS role
    FROM committees cm 
    JOIN committee_members cmm ON cm.committee_id = cmm.committee_id  
    WHERE cmm.member = ? OR cm.committee_chairman = ?`,
    [user_id, user_id, user_id],
    (err, result) => {
      if (err) {
        console.error("Error getting committee sessions: ", err);
        res.json({ ok: false, message: "Error getting committees" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Insert assign course teacher
app.post("/admin/insertAssignCourseTeacher", (req, res) => {
  // course_id and teacher_id are the ids of course_information and user_information respectively
  const { course_id, teacher_id } = req.body;
  db.query(
    `INSERT INTO assign_courses (course_id, teacher_id) VALUES (?, ?)`,
    [course_id, teacher_id],
    (err, result) => {
      if (err) {
        console.error("Error inserting assign course teacher: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({
            ok: false,
            message: "Course already assigned to teacher",
          });
          return;
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          res.json({ ok: false, message: "Teacher OR Course does not exist" });
          return;
        } else {
          res.json({
            ok: false,
            message: "Error inserting assign course teacher",
          });
          return;
        }
      }
      res.json({
        ok: true,
        message: "Course assigned to teacher successfully",
      });
    }
  );
});

// Delete assign course teacher by course_id and teacher_id
app.post("/admin/deleteAssignCourseTeacher", (req, res) => {
  // course_id and teacher_id are the ids of course_information and user_information respectively
  const { course_id, teacher_id } = req.body;
  db.query(
    `DELETE FROM assign_courses WHERE course_id = ? AND teacher_id = ?`,
    [course_id, teacher_id],
    (err, result) => {
      if (err) {
        console.error("Error deleting assign course teacher: ", err);
        res.json({
          ok: false,
          message: "Error deleting assign course teacher",
        });
        return;
      }
      res.json({
        ok: true,
        message: "Course unassigned from teacher successfully",
      });
    }
  );
});

// Get all assign courses List by teacher_id with all course information and teacher information
app.post("/admin/allAssignCoursesByTeacher", (req, res) => {
  // teacher_id is the userId of a user
  const { teacher_id } = req.body;
  db.query(
    `SELECT ac.*, cr.*, user.* FROM assign_courses ac 
    JOIN course_information cr ON ac.course_id = cr.course_id 
    JOIN user_information user ON ac.teacher_id = user.userId 
    WHERE ac.teacher_id = ?`,
    [teacher_id],
    (err, result) => {
      if (err) {
        console.error("Error getting assign courses: ", err);
        res.json({ ok: false, message: "Error getting assign courses" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Insert Course Information
app.post("/admin/insertCourse", (req, res) => {
  const {
    course_id,
    course_name,
    credit_hour,
    classTest_total_marks,
    attendance_total_marks,
    final_total_marks,
    session,
  } = req.body;
  db.query(
    `INSERT INTO course_information (course_id, course_name, credit_hour, classTest_total_marks, attendance_total_marks, final_total_marks, session) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      course_id,
      course_name,
      credit_hour,
      classTest_total_marks,
      attendance_total_marks,
      final_total_marks,
      session,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting course: ", err);
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ ok: false, message: "Course already exists" });
          return;
        } else {
          res.json({ ok: false, message: "Error inserting course" });
          return;
        }
      }
      res.json({ ok: true, message: "Course inserted successfully" });
    }
  );
});

// Update Course Information by course_id
app.post("/admin/updateCourse", (req, res) => {
  const {
    course_id,
    course_name,
    credit_hour,
    classTest_total_marks,
    attendance_total_marks,
    final_total_marks,
    session,
  } = req.body;
  db.query(
    `UPDATE course_information SET course_name = ?, credit_hour = ?, classTest_total_marks = ?, attendance_total_marks = ?, final_total_marks = ?, session = ? WHERE course_id = ?`,
    [
      course_name,
      credit_hour,
      classTest_total_marks,
      attendance_total_marks,
      final_total_marks,
      session,
      course_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating course: ", err);
        res.json({ ok: false, message: "Error updating course" });
        return;
      }
      res.json({ ok: true, message: "Course updated successfully" });
    }
  );
});

// Delete Course by course_id
app.post("/admin/deleteCourse", (req, res) => {
  const { course_id } = req.body;
  db.query(
    `DELETE FROM course_information WHERE course_id = ?`,
    [course_id],
    (err, result) => {
      if (err) {
        console.error("Error deleting course: ", err);
        res.json({ ok: false, message: "Error deleting course" });
        return;
      }
      res.json({ ok: true, message: "Course deleted successfully" });
    }
  );
});

// Get all courses List
app.post("/admin/allCourses", (req, res) => {
  db.query(`SELECT * FROM course_information`, (err, result) => {
    if (err) {
      console.error("Error getting courses: ", err);
      res.json({ ok: false, message: "Error getting courses" });
      return;
    }
    res.json({ ok: true, message: result });
  });
});

// Get all courses List by session
app.post("/admin/allCoursesBySession", (req, res) => {
  const { session } = req.body;
  db.query(
    `SELECT * FROM course_information WHERE session = ?`,
    [session],
    (err, result) => {
      if (err) {
        console.error("Error getting courses: ", err);
        res.json({ ok: false, message: "Error getting courses" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});
// Admin Section End

// Insert Result Information
// This will be used by teachers to insert results of students
app.post("/server/insertCourseResults", (req, res) => {
  // allResults is an array of objects containing student_id, classTest_obtain_marks, attendance_obtain_marks, final_obtain_marks
  const { allResults, course_id, session } = req.body;
  const valuesData = allResults.map((result) => [
    result.student_id,
    course_id,
    result.classTest_obtain_marks,
    result.attendance_obtain_marks,
    result.final_obtain_marks,
    session,
  ]);

  const placeholders = valuesData.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
  const flattenedValues = valuesData.reduce((acc, val) => acc.concat(val), []);

  // Constructing the ON DUPLICATE KEY UPDATE part of the query
  const updateClause = `
  classTest_obtain_marks = VALUES(classTest_obtain_marks),
  attendance_obtain_marks = VALUES(attendance_obtain_marks),
  final_obtain_marks = VALUES(final_obtain_marks),
  session = VALUES(session)
`;
  const sqlQuery = `
  INSERT INTO course_results 
  (student_id, course_id, classTest_obtain_marks, attendance_obtain_marks, final_obtain_marks, session) 
  VALUES ${placeholders} 
  ON DUPLICATE KEY UPDATE ${updateClause}
`;

  db.query(sqlQuery, flattenedValues, (err, result) => {
    if (err) {
      console.error("Error inserting result: ", err);
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ ok: false, message: "Result already exists" });
        return;
      } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
        res.json({ ok: false, message: "Student OR Course does not exist" });
        return;
      } else {
        res.json({ ok: false, message: "Error inserting result" });
        return;
      }
    }
    res.json({ ok: true, message: "Result inserted successfully" });
  });
});

// Get all results List by course_id with all course information and student information
// This will be used by individual teacher to see results of his course
app.post("/server/allResultsByCourse", (req, res) => {
  const { course_id } = req.body;
  db.query(
    `SELECT rs.*, cr.*, st.* FROM course_results rs 
    JOIN course_information cr ON rs.course_id = cr.course_id 
    JOIN students st ON rs.student_id = st.student_id 
    WHERE rs.course_id = ?`,
    [course_id],
    (err, result) => {
      if (err) {
        console.error("Error getting results: ", err);
        res.json({ ok: false, message: "Error getting results" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Get all results List by session with all course information and student information
// This will return all results of all courses of a session
app.post("/server/allResultsBySession", (req, res) => {
  const { session } = req.body;
  db.query(
    `SELECT rs.*, cr.*, st.* FROM course_results rs 
    JOIN course_information cr ON rs.course_id = cr.course_id 
    JOIN students st ON rs.student_id = st.student_id 
    WHERE rs.session = ?`,
    [session],
    (err, result) => {
      if (err) {
        console.error("Error getting results: ", err);
        res.json({ ok: false, message: "Error getting results" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Get all results List by student_id with all course information and student information
// This will be used by individual student to see his results
app.post("/server/allResultsByStudent", (req, res) => {
  const { student_id } = req.body;
  db.query(
    `SELECT rs.*, cr.*, st.* FROM course_results rs 
    JOIN course_information cr ON rs.course_id = cr.course_id 
    JOIN students st ON rs.student_id = st.student_id 
    WHERE rs.student_id = ?`,
    [student_id],
    (err, result) => {
      if (err) {
        console.error("Error getting results: ", err);
        res.json({ ok: false, message: "Error getting results" });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Insert sessional_viva_results
// This will be used by teachers to insert sessional viva results of students
app.post("/server/insertSessionalVivaResults", (req, res) => {
  // allResults is an array of objects containing student_id, field_obtain_marks, slide_obtain_marks, note_obtain_marks, viva_obtain_marks
  const {
    allResults,
    session
  } = req.body;
  const valuesData = allResults.map((result) => [
    result.student_id,
    result.field_obtain_marks,
    result.field_total_marks,
    result.slide_obtain_marks,
    result.slide_total_marks,
    result.note_obtain_marks,
    result.note_total_marks,
    result.viva_obtain_marks,
    result.viva_total_marks,
    session,
  ]);

  const placeholders = valuesData
    .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .join(", ");
  const flattenedValues = valuesData.reduce((acc, val) => acc.concat(val), []);

  // Constructing the ON DUPLICATE KEY UPDATE part of the query
  const updateClause = `
  field_obtain_marks = VALUES(field_obtain_marks),
  field_total_marks = VALUES(field_total_marks),
  slide_obtain_marks = VALUES(slide_obtain_marks),
  slide_total_marks = VALUES(slide_total_marks),
  note_obtain_marks = VALUES(note_obtain_marks),
  note_total_marks = VALUES(note_total_marks),
  viva_obtain_marks = VALUES(viva_obtain_marks),
  viva_total_marks = VALUES(viva_total_marks),
  session = VALUES(session)
`;
  const sqlQuery = `
  INSERT INTO sessional_viva_results 
  (student_id, field_obtain_marks, field_total_marks, slide_obtain_marks, slide_total_marks, note_obtain_marks, note_total_marks, viva_obtain_marks, viva_total_marks, session) 
  VALUES ${placeholders} 
  ON DUPLICATE KEY UPDATE ${updateClause}
`;

  db.query(sqlQuery, flattenedValues, (err, result) => {
    if (err) {
      console.error("Error inserting sessional viva result: ", err);
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ ok: false, message: "Result already exists" });
        return;
      } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
        res.json({ ok: false, message: "Student does not exist" });
        return;
      } else {
        res.json({ ok: false, message: "Error inserting result" });
        return;
      }
    }
    res.json({ ok: true, message: "Result inserted successfully" });
  });
});

// Get all sessional viva results List by student_id with same session's all courses average classTest, attendance obtain marks with student information
// This will be used by individual student to see his sessional viva results
app.post("/server/allSessionalVivaResultsByStudent", (req, res) => {
  const { student_id, session } = req.body;
  db.query(
    `SELECT 
    sv.*,
    st.*,
    COALESCE(AVG(rs.classTest_obtain_marks), 0) AS avg_classTest,
    COALESCE(AVG(rs.attendance_obtain_marks), 0) AS avg_attendance
FROM 
    sessional_viva_results sv
JOIN 
    students st ON sv.student_id = st.student_id
LEFT JOIN 
    course_results rs ON rs.student_id = sv.student_id AND rs.session = sv.session
WHERE 
    sv.student_id = ? 
    AND sv.session = ?
GROUP BY 
    sv.student_id, sv.session;
`,
    [student_id, session],
    (err, result) => {
      if (err) {
        console.error("Error getting sessional viva results: ", err);
        res.json({
          ok: false,
          message: "Error getting sessional viva results",
        });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Get all sessional viva results List by student_id with same session's all courses average classTest, attendance obtain marks with student information
// This will be used by all student to see their sessional viva results

app.post("/server/allSessionalVivaResultsBySession", (req, res) => {
  const { session } = req.body;
  db.query(
    `SELECT 
    sv.*, 
    st.*, 
    COALESCE(AVG(rs.classTest_obtain_marks), 0) AS avg_classTest,
    COALESCE(AVG(rs.attendance_obtain_marks), 0) AS avg_attendance
FROM 
    sessional_viva_results sv 
JOIN 
    students st ON sv.student_id = st.student_id 
LEFT JOIN 
    course_results rs ON rs.student_id = sv.student_id AND rs.session = sv.session
WHERE 
    sv.session = ?
GROUP BY 
    sv.student_id;
`,
    [session],
    (err, result) => {
      if (err) {
        console.error("Error getting sessional viva results: ", err);
        res.json({
          ok: false,
          message: "Error getting sessional viva results",
        });
        return;
      }
      res.json({ ok: true, message: result });
    }
  );
});

// Start the server
app.get("/", (req, res) => {
  res.send("Welcome to the Result Management System API");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
