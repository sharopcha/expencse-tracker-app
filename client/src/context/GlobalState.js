import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import AppReducer from './AppReducer';

// initial state
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

// create context

export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const host = '/api/v1/transaction';

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // actions
  async function getTransactions() {
    try {
      const res = await axios.get(host);

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.res.data.error,
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`${host}/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.res.data.error,
      });
    }
  }

  async function addTransaction(transaction) {
    try {
      const res = await axios.post(host, transaction, config);
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.res.data.error,
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        deleteTransaction,
        addTransaction,
        getTransactions,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
