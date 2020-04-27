import { html } from 'uhtml';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';
import { Todo } from '../types';

type TodoProps = {
  updateTodo: (todoId: number, title: string) => void;
  removeTodo: (todoId: number) => void;
  toggleTodo: (todoId: number) => void;
  focusedTodoId: number;
  setFocusedTodoId: (todoId: number | null) => void;
};

function renderTodo(todo: Todo, { focusedTodoId, updateTodo, removeTodo, toggleTodo, setFocusedTodoId }: TodoProps) {
  const onKeyDown = (event: KeyboardEvent) => {
    console.log(event.keyCode);
    if (event.keyCode === ESCAPE_KEY) {
      setFocusedTodoId(null);
      return;
    }

    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    if (event.keyCode === ENTER_KEY && value.length) {
      updateTodo(todo.id, value);
      target.value = value;
      setFocusedTodoId(null);
    }
  };

  const className = [todo.completed && 'completed', todo.id === focusedTodoId && 'editing'].filter(Boolean).join(' ');

  return html`
    <li class=${className}>
      <div class="view">
        <input class="toggle" type="checkbox" .checked=${todo.completed} onchange=${() => toggleTodo(todo.id)} />
        <label ondblclick=${() => setFocusedTodoId(todo.id)}>${todo.title}</label>
        <button class="destroy" onclick=${() => removeTodo(todo.id)}></button>
      </div>
      <input class="edit" .value=${todo.title} onblur=${() => setFocusedTodoId(null)} onkeydown=${onKeyDown} />
    </li>
  `;
}

type Props = {
  todos: Todo[];
  isAllTodosCompleted: boolean;
  updateTodo: (todoId: number, title: string) => void;
  removeTodo: (todoId: number) => void;
  toggleTodo: (todoId: number) => void;
  toggleAllTodos: () => void;
  focusedTodoId: number;
  setFocusedTodoId: (todoId: number | null) => void;
};

export function main({ todos, isAllTodosCompleted, toggleAllTodos, ...props }: Props) {
  return html`
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" .checked=${isAllTodosCompleted} onchange=${toggleAllTodos} />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        ${todos.map(todo => renderTodo(todo, props))}
    </section>
  `;
}
