import './App.scss';
import React, { useState } from 'react';
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

interface AppProps {
  initialUsers: User[];
  initialTodos: Todo[];
}

export const App: React.FC<AppProps> = ({ initialUsers, initialTodos }) => {
  const enrichedTodos: Todo[] = initialTodos.map(todo => {
    const matchedUser = initialUsers.find(user => user.id === todo.userId);

    return {
      ...todo,
      user: matchedUser ?? {
        id: 0,
        name: 'Unknown',
        username: 'unknown',
        email: 'unknown@example.com',
      }, // Fallback user
    };
  });

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

    const selectedUser = initialUsers.find(
      user => user.id === selectedUserId,
    ) ?? {
      id: 0,
      name: 'Unknown',
      username: 'unknown',
      email: 'unknown@example.com',
    };

    const newTodo: Todo = {
      id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
      title,
      userId: typeof selectedUserId === 'number' ? selectedUserId : 0,
      completed: false,
      user: selectedUser,
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
            value={selectedUserId}
            onChange={e => {
              const value = Number(e.target.value);

              setSelectedUserId(isNaN(value) ? '' : value);
              if (errors.userId) {
                setErrors(prev => ({ ...prev, userId: '' }));
              }
            }}
          >
            <option value="">Choose a user</option>
            {initialUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && <span className="error">{errors.userId}</span>}
        </div>

        <button type="submit" className="button">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
