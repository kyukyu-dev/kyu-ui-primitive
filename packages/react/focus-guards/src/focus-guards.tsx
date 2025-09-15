import * as React from 'react';

let count = 0;

interface FocusGuardsProps {
  children?: React.ReactNode;
}

function FocusGuards(props: FocusGuardsProps) {
  useFocusGuards();
  return props.children;
}

function useFocusGuards() {
  React.useEffect(() => {
    const edgeGuards = document.querySelectorAll('[data-kyui-focus-guard]');
    document.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard());
    count++;

    return () => {
      if (count === 1) {
        document.querySelectorAll('[data-kyui-focus-guard]').forEach((node) => node.remove());
      }
      count--;
    };
  }, []);
}

function createFocusGuard() {
  const element = document.createElement('span');
  element.setAttribute('data-kyui-focus-guard', '');
  element.tabIndex = 0;
  element.style.outline = 'none';
  element.style.opacity = 'none';
  element.style.position = 'fixed';
  element.style.pointerEvents = 'none';
  return element;
}

export { FocusGuards, FocusGuards as Root, useFocusGuards };
