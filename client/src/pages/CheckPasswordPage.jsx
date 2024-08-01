// dispatch: This is a function used to send actions to the Redux store.
// setToken: This is an action creator function used to store the token in the Redux store.
// localStorage: This is a Web Storage API that allows storing data locally in the user's browser.
// setData: This is likely a state updater function from a useState hook.
// navigate: This is a function used to change the route in a React Router.
// toast: This is probably a method from a library like react-toastify to show notifications.

import React, { useEffect,useState } from 'react';
// React icons
import { IoMdClose } from "react-icons/io";

// To store photo on Cloudinary
import uploadFile from '../helpers/uploadfile';
import axios from 'axios';
import toast from 'react-hot-toast';

// React Router provides hooks that make it easier to interact with the routing system in a React application.
// These hooks allow you to navigate programmatically and access information about the current route.
import { Link, useLocation, useNavigate } from 'react-router-dom';
// The useNavigate hook returns a function that lets you navigate programmatically within your application
      // UseLocation -->  The useLocation hook returns the current location object, which represents the current URL.
      // It's useful for accessing the state and pathname of the current route.
      // location is an object containing information about the current URL, such as pathname, search, and state.

// For user-icon
import { HiUserCircle } from "react-icons/hi2";

// Profile icon
import Profile from '../components/Profile';

// For redux
import { useDispatch } from 'react-redux'
import { setUser , setToken } from '../redux/userSlice'


const CheckPasswordPage = () => {

    const [data, setData] = useState({
        password: "", 
        userId: ""
      });
    
      const navigate = useNavigate();
      const location = useLocation();
      //console.log("Location",location.state )
      const dispatch = useDispatch()

      // The dependencies ( [location,navigate] ) of useEffect determine when it runs. the callback function...
      useEffect( () => {
        if(!location?.state?.name ){
            navigate("/email");
        }
      },[location,navigate])

      const handleOnChange = (ele) => {
        const { name, value } = ele.target;
    
        setData((prev) => {
          return {
            ...prev,
            [name]: value
          };
        });
      };
    
      const handleSubmit = async (ele) => {
        ele.preventDefault();
        ele.stopPropagation();
    
        const URL = `${import.meta.env.VITE_APP_BACKENED_URL}/api/password`;
    
        try {
          
          const response = await axios({

            method: 'post',
            url: URL,
            data: {
              userId: location?.state?._id,
              password: data.password
            },
            withCredentials: true
          });
          toast.success(response.data.message);
    
          if (response.data.success) {
          
            // Dispatch the setUser action with the correct payload
            dispatch(setUser({
              _id: location.state._id,
              name: location.state.name,
              email: location.state.email,
              profile_pic: location.state.profile_pic
            }));
            
            dispatch(setToken(response?.data?.token))
            
            // Store the token and user data in localStorage
            localStorage.setItem('token', response?.data?.token);
            localStorage.setItem('user', JSON.stringify({
                _id: location.state._id,
                name: location.state.name,
                email: location.state.email,
                profile_pic: location.state.profile_pic
            }));

            setData({
              password: "", 
            });
            navigate("/");
          }
        } catch (err) {
          toast.error(err?.response?.data?.message);
        }
      };

    return (
        <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='flex justify-center items-center flex-col w-fit mx-auto mb-2'>
            {/* <HiUserCircle 
                size={50}
            /> */}
            <Profile 
                width={115}
                height={115}
                name={location?.state?.name}
                imageUrl={location?.state?.profile_pic}
            />
            <h1 className='text-2xl font-semibold text-zinc-600'>{location?.state?.name}</h1>
        </div>
        <h1 className='font-bold text-red-400 mt-2'>Welcome to Chat App!</h1>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          {/* Email field */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password : </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-3 py-2 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-2xl px-5 py-1 rounded text-white font-semibold hover:bg-secondary'>
            Login
          </button>
        </form>

        <p className='my-4 text-center'>
        <Link to={"/forgotPassword"} className='font-bold hover:text-primary cursor-pointer'>Forgot password ?</Link>
        </p>
      </div>
    </div>
    )
}

export default CheckPasswordPage 