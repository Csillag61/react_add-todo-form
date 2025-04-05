import React from 'react';
import TodoInfo from '../TodoInfo/TodoInfo';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user: {
    name: string;
    email: string;
  };
}
interface TodoListProps {
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <section className="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          title={todo.title}
          completed={todo.completed}
          userName={todo.user.name}
          userEmail={todo.user.email}
        />
      ))}
    </section>
  );
};

export default TodoList;
