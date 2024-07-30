

import React, { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, logout, setOnlineUser, setSocketConnection } from '../redux/userSlice'
import { Sidebar } from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user", user);

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_APP_BACKENED_URL}/api/userDetails`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      })

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
      console.log("Current User details", response);
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, []);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_APP_BACKENED_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    })

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    }
  }, []);

  const basePath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      <section className={`relative ${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      {basePath && (
        <div className='hidden lg:block absolute inset-0 lg:flex justify-center items-center flex-col gap-2'>
          <img
            src={logo}
            width={280}
            alt='logo'
          />
          <p className='text-slate-700 font-semibold text-lg mt-1'>Select user to send message</p>
        </div>
      )}
    </div>
  )
}

export default Home
