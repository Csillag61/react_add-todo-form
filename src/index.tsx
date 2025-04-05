import { createRoot } from 'react-dom/client';
import { App } from './App';

const fetchData = async () => {
  try {
    const usersResponse = await fetch('/api/users');
    const todosResponse = await fetch('/api/todos');

    if (!usersResponse.ok || !todosResponse.ok) {
      throw new Error('Failed to fetch data from the server.');
    }

    const initialUsers = await usersResponse.json();
    const initialTodos = await todosResponse.json();

    createRoot(document.getElementById('root') as HTMLElement).render(
      <App initialUsers={initialUsers} initialTodos={initialTodos} />,
    );
  } catch (error) {
    if (error instanceof Error) {
      const rootElement = document.getElementById('root');

      if (rootElement) {
        rootElement.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
      }
    } else {
      const rootElement = document.getElementById('root');

      if (rootElement) {
        rootElement.innerHTML = `<p style="color: red;">An unknown error occurred.</p>`;
      }
    }
  }
};

fetchData();
