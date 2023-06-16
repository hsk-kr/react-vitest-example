import { ChangeEventHandler, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import Todo from '../Todo';

export type TodoItem = {
  id: string;
  todo: string;
  checked: boolean;
};

const TodoList = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const handleTodoAdd = () => {
    const todoText = inputRef.current?.value ?? '';

    setTodos((prevTodos) => addTodo(prevTodos, todoText));
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleTodoDelete = (id: string) => () => {
    setTodos((prevTodos) => deleteTodo(prevTodos, id));
  };

  const handleTodoToggle =
    (id: string): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      setTodos((prevTodos) =>
        changeTodoChecked(prevTodos, id, e.target.checked)
      );
    };

  return (
    <>
      <button data-testid="add" onClick={handleTodoAdd}>
        Add New Todo
      </button>
      <input data-testid="newTodoInput" type="text" ref={inputRef} />
      <hr />
      <div data-testid="todos">
        {todos.map(({ id, ...todo }) => (
          <Todo
            key={id}
            {...todo}
            onDelete={handleTodoDelete(id)}
            onToggle={handleTodoToggle(id)}
          />
        ))}
      </div>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function addTodo(todoList: TodoItem[], todoText: string): TodoItem[] {
  return todoList.concat({
    id: uuidV4(),
    todo: todoText,
    checked: false,
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export function deleteTodo(todoList: TodoItem[], id: string): TodoItem[] {
  return todoList.filter((todo) => todo.id !== id);
}

// eslint-disable-next-line react-refresh/only-export-components
export function changeTodoChecked(
  todoList: TodoItem[],
  id: string,
  checked: boolean
): TodoItem[] {
  return todoList.map((todo) => {
    const newTodo = { ...todo };
    if (newTodo.id === id) {
      newTodo.checked = checked;
    }

    return newTodo;
  });
}

export default TodoList;
