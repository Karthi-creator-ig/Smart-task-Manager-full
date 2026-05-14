const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MYSQL CONNECTION

const db = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "1234567890987654321",
  database: "smart_task_manager"

});

// CONNECT MYSQL

db.connect((err) => {

  if (err) {

    console.log(err);

  }
  else {

    console.log("MySQL Connected");

  }

});

// REGISTER

app.post("/register", (req, res) => {

  const { username, password } = req.body;

  const sql =
  "INSERT INTO users (username,password) VALUES (?,?)";

  db.query(sql, [username, password], (err, result) => {

    if (err) {

      console.log(err);

      res.send({
        success: false,
        message: "User Exists"
      });

    }
    else {

      res.send({
        success: true,
        message: "Registration Successful"
      });

    }

  });

});

// LOGIN

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const sql =
  "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {

    if (err) {

      console.log(err);

      res.send({
        success: false
      });

    }
    else {

      if (result.length > 0) {

        res.send({
          success: true
        });

      }
      else {

        res.send({
          success: false
        });

      }

    }

  });

});

// ADD TASK

app.post("/tasks", (req, res) => {

  const {
    title,
    description,
    priority,
    due_date,
    status,
    username
  } = req.body;

  const sql = `
  INSERT INTO tasks
  (title,description,priority,due_date,status,username)
  VALUES (?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      priority,
      due_date,
      status,
      username
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        res.send({
          success: false
        });

      }
      else {

        res.send({
          success: true,
          message: "Task Added"
        });

      }

    }
  );

});

// GET TASKS

app.get("/tasks/:username", (req, res) => {

  const username = req.params.username;

  const sql =
  "SELECT * FROM tasks WHERE username=?";

  db.query(sql, [username], (err, result) => {

    if (err) {

      console.log(err);

      res.send([]);

    }
    else {

      res.send(result);

    }

  });

});

// DELETE TASK

app.delete("/tasks/:id", (req, res) => {

  const id = req.params.id;

  const sql =
  "DELETE FROM tasks WHERE id=?";

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      res.send({
        success: false
      });

    }
    else {

      res.send({
        success: true
      });

    }

  });

});

// UPDATE TASK

app.put("/tasks/:id", (req, res) => {

  const id = req.params.id;

  const { status } = req.body;

  const sql =
  "UPDATE tasks SET status=? WHERE id=?";

  db.query(sql, [status, id], (err, result) => {

    if (err) {

      console.log(err);

      res.send({
        success: false
      });

    }
    else {

      res.send({
        success: true
      });

    }

  });

});

// SERVER

app.listen(5000, () => {

  console.log("Server Running on Port 5000");

});