import './App.scss';
import React, { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import TodoList from './components/TodoList/TodoList';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user: User;
}

const users: User[] = usersFromServer;
const enrichedTodos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: users.find(user => user.id === todo.userId) as User, // Match user by userId
}));

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(enrichedTodos);
  const [title, setTitle] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [errors, setErrors] = useState({ title: '', userId: '' });

  const handleAddTodo = () => {
    const newErrors = {
      title: title ? '' : 'Please enter a title',
      userId: selectedUserId ? '' : 'Please choose a user',
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.userId) {
      return;
    }

    const selectedUser = users.find(user => user.id === selectedUserId);

    const newTodo: Todo = {
      id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
      title,
      userId: selectedUserId as number,
      completed: false,
      user: selectedUser as User,
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);

    setTitle('');
    setSelectedUserId('');
    setErrors({ title: '', userId: '' });
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        className="todo-form"
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <div className="field">
          <label htmlFor="titleInput">Title</label>
          <input
            type="text"
            id="titleInput"
            data-cy="titleInput"
            placeholder="Enter todo title"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: '' }));
              }
            }}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="userSelect">User</label>
          <select
            id="userSelect"
            data-cy="userSelect"
            value={selectedUserId}
            onChange={e => {
              setSelectedUserId(Number(e.target.value) || '');
              if (errors.userId) {
                setErrors(prev => ({ ...prev, userId: '' }));
              }
            }}
          >
            <option value="">Choose a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && <span className="error">{errors.userId}</span>}
        </div>

        <button type="submit" data-cy="submitButton" className="button">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
