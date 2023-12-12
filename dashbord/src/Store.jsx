/* eslint-disable react/prop-types */
// @ts-nocheck
import { createContext, useReducer } from 'react';

export const Store = createContext();

const intialState = {
  userprivateInfo: localStorage.getItem('userprivateInfo')
    ? JSON.parse(localStorage.getItem('userprivateInfo'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userprivateInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userprivateInfo: null,
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, intialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
