const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username)

  if (!user) {
    return response.status(400).json({ error: "Username not found" })
  }

  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  request.headers

  const validIsExistsUser = users.some((user) => user.username === username);

  if (validIsExistsUser) {
    return response.status(400).json({ error: "User already exists!" })
  }

  stateUserOperations = {
    name,
    username,
    id: uuidv4(),
    todos: []
  };

  users.push(stateUserOperations);

  return response.status(201).json(stateUserOperations)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const todos = user.todos;

  return response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const stateTodoOperation = {
    id: uuidv4(),
    title,
    deadline,
    done: false
  }

  const { user } = request;

  user.todos.push(stateTodoOperation);

  return response.status(201).json(stateTodoOperation);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  user.todos.map((todo) => {
    if (todo.id === id) {
      todo.deadline = deadline;
      todo.title = title;
      return response.status(200).send();
    }
  })

  return response.json({ error: "Todo not found" });
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  user.todos.map((todo) => {
    if (todo.id === id) {
      todo.done = true;
      return response.send(200).send();
    }
  })
  return response.json({ error: "Todo not found" });
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const params = request.params;
  const { user } = request;

  user.todos.splice(params, 1)

  return response.status(200).send();
});

module.exports = app;