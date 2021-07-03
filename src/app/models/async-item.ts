export enum AsyncItemState {
  Loading = 'loading',
  Error = 'error',
  Loaded = 'loaded',
  Uninitialized = 'uninitialized'
}

export interface AsyncItem<T> {
  state: AsyncItemState;
  data?: T;
  errors?: Error[];
}

export function makeAsyncItem<T>(state: AsyncItemState, data: T): AsyncItem<T> {
  return { state, data };
}
