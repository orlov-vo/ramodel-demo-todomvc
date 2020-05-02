import 'todomvc-common/base.js';
import { watch, makeLense, combineLenses } from 'ramodel';
import { connectWorker } from 'ramodel/remote';
import { render, html } from 'uhtml';
import { header } from './views/header';
import { main } from './views/main';
import { footer } from './views/footer';
import { Controller } from './models/Controller';
import { TodoManager } from './models/TodoManager';
import { ROUTE } from './constants';
import { Todo, Values } from './types';

const worker = new Worker('./worker.ts');

async function init() {
  const remoteWorld = connectWorker(worker);

  const manager = await remoteWorld.get<TodoManager>('manager');
  const controller = new Controller({});

  const appElement = document.querySelector('.todoapp');

  const getVisibleTodosLense = combineLenses(
    [
      makeLense(controller, _ => _.activeRoute),
      makeLense(manager, _ => _.items),
      makeLense(manager, _ => _.activeItems),
      makeLense(manager, _ => _.completedItems),
    ],
    (activeRoute: Values<typeof ROUTE>, all: Todo[], active: Todo[], completed: Todo[]) => {
      switch (activeRoute) {
        case ROUTE.ACTIVE:
          return active;
        case ROUTE.COMPLETED:
          return completed;
        default:
          return all;
      }
    },
  );

  watch(
    [
      getVisibleTodosLense,
      makeLense(manager, _ => _.items.length > 0),
      makeLense(manager, _ => _.activeItems.length),
      makeLense(controller, _ => _.activeRoute),
      makeLense(controller, _ => _.focusedTodoId),
    ],
    (visibleTodos, isListVisible, leftItems, activeRoute, focusedTodoId) => {
      if (!appElement) {
        return;
      }

      render(
        appElement,
        html`
          ${[
            header({ add: manager.add }),
            isListVisible &&
              main({
                todos: visibleTodos,
                focusedTodoId,
                isAllTodosCompleted: leftItems === 0,
                updateTodo: manager.update,
                removeTodo: manager.remove,
                toggleTodo: manager.toggle,
                toggleAllTodos: manager.toggleAll,
                setFocusedTodoId: controller.setFocusedTodoId,
              }),
            isListVisible && footer({ leftItems, activeRoute, clearCompleted: manager.clearCompleted }),
          ].filter(Boolean)}
        `,
      );
    },
  );
}

init();
