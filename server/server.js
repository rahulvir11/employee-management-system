const express = require("express");
const app = express();
const cors = require("cors");
const  fs = require("fs");
const db = require("./db/connection");
const path = require("path");
const employeeFormValidate = require("./validators/employeeSchema");
const upload = require('./multer')
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// login
app.post("/api/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Query the database for the user
    const data = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE userName = ?";
      db.query(sql, [name], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });

    // Check if the user exists
    if (!data) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Check if the password matches
    if (password === data.pwd) {
      return res.status(200).json({ success: true, message: "Successful login", userName: data.userName });
    } else {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Server side issue" });
  }
});

// Get all employees
app.get("/api/employee", (req, res) => {
  const sqlQuery = "SELECT * FROM employees";

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve employees",
      });
    }

    // Send the retrieved data as a JSON response
    return res.status(200).json({
      success: true,
      data: results,
    });
  });
});

// Get one employee
app.get('/api/employee/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM employees WHERE eid = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: results[0] });
  });
});

// Route to handle employee creation
app.post("/api/employee", upload.single("file"), async (req, res) => {
  try {
    const { name, email, mobileNo, designation, gender, course } = req.body;
    const file = req.file;
    const imagePath = `/uploads/${file.filename}`;
    // console.log(imagePath);
    const validationResult = await employeeFormValidate({
      name,
      email,
      mobileNo,
      designation,
      gender,
      course,
    });
    // console.log(validationResult);

    if (!validationResult.success) {
      return res.status(400).json({ success: false, message: validationResult.error });
    }

    // Check if file is provided
    if (!file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    // Check for duplicate email
    const emailCheckQuery = "SELECT * FROM employees WHERE email = ?";
    db.query(emailCheckQuery, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      // If the email already exists, prevent duplicate entry
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }

      // Insert new employee into the database
      const sqlInsert = `
        INSERT INTO employees (ename, email, mobile, designation, gender, course, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        sqlInsert,
        [name, email, mobileNo, designation, gender, course, imagePath],
        (insertErr) => {
          if (insertErr) {
            return res.status(500).json({ success: false, message: "Failed to add employee" });
          }
          return res.status(201).json({ success: true, message: "Employee added successfully" });
        }
      );
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server-side error",
    });
  }
});

app.put('/api/employee/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const { name, email, mobileNo, designation, gender, course } = req.body;

  try {
    // Check if employee exists
    const checkEmployeeQuery = 'SELECT * FROM employees WHERE eid = ?';
    db.query(checkEmployeeQuery, [id], async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      // Validate the incoming data
      const validationResult = await employeeFormValidate({
        name,
        email,
        mobileNo,
        designation,
        gender,
        course,
      });

      if (!validationResult.success) {
        return res.status(400).json({ success: false, message: validationResult.error });
      }

      // Check if a new file is uploaded
      let imageUrl = results[0].imageUrl; // Keep the existing image path if no new file is uploaded
      if (file) {
        imageUrl = `/uploads/${file.filename}`;
        const filePath = path.join(__dirname,"public",results[0].imageUrl);
        fs.unlink(filePath, (fsErr) => {
          if (fsErr) {
            console.error('Error deleting file:', fsErr);
          }
        });
      }

      // Update the employee record in the database
      const updateQuery = `
        UPDATE employees 
        SET ename = ?, email = ?, mobile = ?, designation = ?, gender = ?, course = ?, imageUrl = ?
        WHERE eid = ?
      `;
      db.query(
        updateQuery,
        [name, email, mobileNo, designation, gender, course, imageUrl, id],
        (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({ success: false, message: 'Error updating employee' });
          }
          return res.status(201).json({ success: true, message: 'Employee updated successfully' ,updateResult });
        }
      );
    });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE route to delete an employee by ID
app.delete('/api/employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Check if the employee exists in the database
    const checkEmployeeQuery = 'SELECT * FROM employees WHERE eid = ?';
    db.query(checkEmployeeQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      const employee = results[0];
      const imagePath = employee.imageUrl;

      // Step 2: Delete the employee record from the database
      const deleteQuery = 'DELETE FROM employees WHERE eid = ?';
      db.query(deleteQuery, [id], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ success: false, message: 'Error deleting employee' });
        }

        // Step 3: Delete the associated image file if it exists
        if (imagePath) {
          const filePath = path.join(__dirname,"public",imagePath);
          fs.unlink(filePath, (fsErr) => {
            if (fsErr) {
              console.error('Error deleting file:', fsErr);
            }
          });
        }

        return res.status(201).json({ success: true, message: 'Employee deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Start server
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
