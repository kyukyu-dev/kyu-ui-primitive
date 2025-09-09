import * as React from 'react';

const useLayoutEffect = globalThis.document ? React.useLayoutEffect : () => {};

export { useLayoutEffect };
