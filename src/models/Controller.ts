import { createModel } from 'ramodel';
import { useState, useEffect } from 'ramodel/hooks';
import { ROUTE } from '../constants';
import { Values } from '../types';

const parsePathname = (() => {
  const a = document.createElement('a');

  return (href: string) => {
    a.href = href;
    return a.pathname;
  };
})();

function getRoute(pathname: string) {
  switch (pathname) {
    case '/active':
      return ROUTE.ACTIVE;
    case '/completed':
      return ROUTE.COMPLETED;
    default:
      return ROUTE.ALL;
  }
}

export class Controller extends createModel(() => {
  const [focusedTodoId, setFocusedTodoId] = useState<number | null>(null);
  const [activeRoute, setActiveRoute] = useState<Values<typeof ROUTE>>(ROUTE.ALL);

  useEffect(() => {
    const handler = () => {
      const link = location.hash.slice(1);
      setActiveRoute(getRoute(parsePathname(link)));
    };

    window.addEventListener('hashchange', handler, false);

    return () => {
      window.removeEventListener('hashchange', handler, false);
    };
  }, []);

  return {
    activeRoute,
    focusedTodoId,
    setFocusedTodoId,
  };
}) {}
