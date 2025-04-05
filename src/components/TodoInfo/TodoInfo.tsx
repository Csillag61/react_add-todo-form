import React from 'react';
import UserInfo from '../UserInfo/UserInfo';

interface TodoInfoProps {
  title: string;
  completed: boolean;
  userName: string;
  userEmail: string;
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  title,
  completed,
  userName,
  userEmail,
}) => {
  return (
    <article className={`TodoInfo ${completed ? 'TodoInfo--completed' : ''}`}>
      <h2 className="TodoInfo__title">{title}</h2>
      <UserInfo name={userName} email={userEmail} />
    </article>
  );
};

export default TodoInfo;
