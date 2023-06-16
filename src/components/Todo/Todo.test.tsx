import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Todo from '.';

describe('UI', () => {
  it('todo prop should be displayed', async () => {
    render(<Todo todo="hello" />);
    expect(await screen.findByText(/hello/)).toBeInTheDocument();
  });

  it("checked prop should be reflected in the checkbox's checked attr", async () => {
    const fnToPreventWarning = vi.fn;
    let todo = render(<Todo checked={true} onToggle={fnToPreventWarning} />);
    let input = await todo.container.querySelector<HTMLInputElement>('input');
    expect(input?.checked).toBe(true);

    todo = render(<Todo checked={false} onToggle={fnToPreventWarning} />);
    input = await todo.container.querySelector<HTMLInputElement>('input');
    expect(input?.checked).toBe(false);
  });

  it('onToggle method should be called when the input is clicked', async () => {
    const handleToggle = vi.fn();
    const todo = render(<Todo onToggle={handleToggle} />);

    (
      await todo.container.querySelector<HTMLButtonElement>(
        'input[type=checkbox]'
      )
    )?.click();
    expect(handleToggle).toBeCalled();
  });

  it('onDelete method should be called when the delete button is clicked', async () => {
    const handleDelete = vi.fn();
    const todo = render(<Todo onDelete={handleDelete} />);

    await (await todo.findByText(/delete/i)).click();
    expect(handleDelete).toBeCalled();
  });
});
