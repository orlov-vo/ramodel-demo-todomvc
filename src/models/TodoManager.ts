import { createModel } from 'ramodel';
import { useRef, useReducer, useMemo, useCallback } from 'ramodel/hooks';
import { Todo } from '../types';

export class TodoManager extends createModel(() => {
  const idCounter = useRef(0);

  const [items, dispatch] = useReducer((state: Todo[], { type, payload }: any): Todo[] => {
    switch (type) {
      case 'ADD':
        return [
          ...state,
          {
            id: idCounter.current++,
            title: payload,
            completed: false,
          },
        ];
      case 'UPDATE':
        return state.map(i => (i.id === payload.id ? { ...i, title: payload.title } : i));
      case 'REMOVE':
        return state.filter(i => i.id !== payload);
      case 'TOGGLE':
        return state.map(i => (i.id === payload ? { ...i, completed: !i.completed } : i));
      case 'TOGGLE_ALL':
        const isAllCompleted = state.every(i => i.completed);
        return state.map(i => ({ ...i, completed: !isAllCompleted }));
      case 'CLEAR_COMPLETED':
        return state.filter(i => !i.completed);
      default:
        return state;
    }
  }, []);

  const activeItems = useMemo(() => items.filter(i => !i.completed), [items]);
  const completedItems = useMemo(() => items.filter(i => i.completed), [items]);

  const add = useCallback((title: string) => dispatch({ type: 'ADD', payload: title }), []);
  const update = useCallback(
    (todoId: number, title: string) => dispatch({ type: 'UPDATE', payload: { id: todoId, title } }),
    [],
  );
  const remove = useCallback((todoId: number) => dispatch({ type: 'REMOVE', payload: todoId }), []);
  const toggle = useCallback((todoId: number) => dispatch({ type: 'TOGGLE', payload: todoId }), []);
  const toggleAll = useCallback(() => dispatch({ type: 'TOGGLE_ALL' }), []);
  const clearCompleted = useCallback(() => dispatch({ type: 'CLEAR_COMPLETED' }), []);

  return {
    items,
    activeItems,
    completedItems,
    add,
    update,
    remove,
    toggle,
    toggleAll,
    clearCompleted,
  };
}) {}
