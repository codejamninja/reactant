import { Action, AnyAction, Middleware, Reducer, Store } from 'redux';
import { Context, ReactNode } from 'react';
import { Persistor } from 'redux-persist';
import { ReactReduxContextValue } from 'react-redux';

export interface Reducers {
  [key: string]: Reducer;
}

export interface ProviderContext {
  store: Store;
}

export interface ProviderProps<A extends Action = AnyAction> {
  children?: ReactNode | ((bootstrapped: boolean) => ReactNode);
  context?: Context<ReactReduxContextValue>;
  defaultState?: object;
  loading?: ReactNode;
  middlewares?: Middleware[];
  onBeforeLift?(): void | Promise<void>;
  onReady?(store: Store, persistor?: Persistor): any;
  options?: object;
  persistor?: Persistor;
  reducers?: Reducers;
  store?: Store<any, A>;
}

export type StoreContext = React.Context<
  ReactReduxContextValue<any, AnyAction>
>;

export type Provider = any;
