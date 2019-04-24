import appReducer, { initialState } from './app.reducer';
import {
  setApiHost,
  resetApiHost,
} from './app.actions';

test('it has an initial state', () => {
  expect(appReducer(undefined, { type: 'foo' })).toEqual(initialState);
});

test('it sets api host', () => {
  expect(appReducer(initialState, setApiHost('foobar'))).toEqual({
    ...initialState,
    apiHost: 'foobar',
  });
});

test('it resets api host', () => {
  const state = appReducer(initialState, setApiHost('foobar'));
  expect(appReducer(state, resetApiHost())).toEqual({
    ...initialState,
  });
});
