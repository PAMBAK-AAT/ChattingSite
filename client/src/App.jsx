

import './index.css'
import { Outlet } from 'react-router-dom'
// Used for notification purpose
import toast, { Toaster } from 'react-hot-toast'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/userSlice';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // Check for token and user data in localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        dispatch(setToken(token)); // Set token in Redux state
        dispatch(setUser(user)); // Set user data in Redux state
    }
}, [dispatch]);


  return (
    <>
      <Toaster /> 
        <main>
          <Outlet />
        </main>
    </>
  )
}

export default App

