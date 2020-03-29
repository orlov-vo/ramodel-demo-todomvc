import { html } from "uhtml";
import { ROUTE } from "../constants";
import { Values } from "../types";

type Props = {
  leftItems: number;
  activeRoute: Values<typeof ROUTE>;
  clearCompleted: () => void;
};

export function footer({ leftItems, activeRoute, clearCompleted }: Props) {
  return html`
    <footer class="footer">
      <span class="todo-count"><strong>${leftItems}</strong> item left</span>
      <ul class="filters">
        <li>
          <a class=${activeRoute === ROUTE.ALL && "selected"} href="#/">All</a>
        </li>
        <li>
          <a class=${activeRoute === ROUTE.ACTIVE && "selected"} href="#/active">Active</a>
        </li>
        <li>
          <a class=${activeRoute === ROUTE.COMPLETED && "selected"} href="#/completed">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" onclick=${clearCompleted}>Clear completed</button>
    </footer>
  `;
}
