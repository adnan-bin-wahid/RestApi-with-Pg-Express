const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json()); //req.body

// Routes

//get all todo
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});
//get a todo

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query("Select * FROM todo where todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//create a todo
app.post("/todos", async (req, res) => {
  try {
    //await
    console.log(req.body);
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update a

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const unpdateTodo = await pool.query(
      "Update todo SET description = $1 WHERE todo_id=$2",
      [description, id]
    );
    res.json("Todo was updated");
  } catch (err) {
    console.log(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1",
      [id]
    );
    res.json("Todo has successfully deleted");
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
