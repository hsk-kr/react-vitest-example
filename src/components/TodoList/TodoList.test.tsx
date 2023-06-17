import { RenderResult, render } from '@testing-library/react';
import TodoList, { TodoItem, addTodo, changeTodoChecked, deleteTodo } from '.';

const testAddTodo = async (todoList: RenderResult, text: string) => {
  const addBtn = await todoList.findByTestId('add');
  const addText = await todoList.findByTestId('newTodoInput');

  (addText as HTMLInputElement).value = text;
  addBtn.click();
};

describe('UI', () => {
  it('todos should be empty', async () => {
    const todoList = render(<TodoList />);
    const todoElmts = await todoList.findByTestId('todos');

    expect(todoElmts.querySelectorAll('div').length).toBe(0);
  });

  it('A todo should be created', async () => {
    const todoList = render(<TodoList />);

    await testAddTodo(todoList, 'new');

    const todosElmt = await todoList.findByTestId('todos');

    expect(todosElmt.querySelectorAll('div').length).toBe(1);

    const newTodo = await todosElmt.querySelector<HTMLElement>('div');
    const checkbox = await newTodo?.querySelector<HTMLInputElement>('input');

    expect(checkbox?.checked).toBe(false);
    expect(await todoList.findByText('new')).toBeInTheDocument();
  });

  it("A todo's checked should be toggled when the checkbox is clicked", async () => {
    const todoList = render(<TodoList />);

    await testAddTodo(todoList, 'new');

    const checkbox = await todoList.container.querySelector<HTMLInputElement>(
      'input[type=checkbox]'
    );

    await checkbox?.click();
    expect(checkbox?.checked).toBe(true);

    await checkbox?.click();
    expect(checkbox?.checked).toBe(false);
  });

  it('A todo should be deleted when the delete button is clicked', async () => {
    const todoList = render(<TodoList />);

    await testAddTodo(todoList, 'new1');
    await testAddTodo(todoList, 'new2');
    await testAddTodo(todoList, 'new3');

    const todosElmt = await todoList.findByTestId('todos');
    const todoElmtList = await todosElmt.querySelectorAll<HTMLDivElement>(
      'div'
    );

    expect(todoElmtList.length).toBe(3);
    expect(await todoList.findByText('new2')).toBeInTheDocument();
    await todoElmtList[1].querySelector('button')?.click();
    expect(await todoList.findByText('new1')).toBeInTheDocument();
    expect(await todoList.queryByText('new2')).not.toBeInTheDocument();
    expect(await todoList.findByText('new3')).toBeInTheDocument();
  });
});

describe('Functions', () => {
  it('addTodo should return a new todo list with a new item', () => {
    const todo = 'new';
    const newTodoList = addTodo([] as TodoItem[], todo);

    expect(newTodoList.length).toBe(1);
    expect(newTodoList[0].checked).toBe(false);
    expect(newTodoList[0].todo).toBe(todo);
    expect(newTodoList[0].id).toBeDefined();
  });

  it('deleteTodo should return a new todo without deleted the target item', () => {
    const todo = 'new';
    const oldTodoList = addTodo([] as TodoItem[], todo);

    expect(oldTodoList.length).toBe(1);

    const newTodoList = deleteTodo(oldTodoList, oldTodoList[0].id);

    expect(newTodoList.length).toBe(0);
    expect(oldTodoList).not.toEqual(newTodoList);
  });

  it('changeTodoChecked should return a new todo list with the checked property of the target item changed', () => {
    const todo = 'new';
    const oldTodoList = addTodo([] as TodoItem[], todo);

    expect(oldTodoList.length).toBe(1);

    const newTodoList = changeTodoChecked(oldTodoList, oldTodoList[0].id, true);

    expect(newTodoList[0].checked).toBe(true);
    expect(oldTodoList).not.toEqual(newTodoList);
  });
});
