/* eslint-disable react/prop-types */
import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function ProtectedRoute({ children }) {
  const { state } = useContext(Store);
  const { userprivateInfo } = state;
  return userprivateInfo ? children : <Navigate to="/signin" />;
}