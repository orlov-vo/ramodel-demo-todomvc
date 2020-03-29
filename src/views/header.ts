import { html } from "uhtml";
import { ENTER_KEY } from "../constants";

type Props = {
  add: (title: string) => void;
};

export function header({ add }: Props) {
  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    if (event.keyCode === ENTER_KEY && value.length) {
      add(value);
      target.value = "";
    }
  };

  return html`
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autofocus
        onkeydown=${onKeyDown}
      />
    </header>
  `;
}
