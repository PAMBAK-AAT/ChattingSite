import React, { useState } from 'react';
// React icons
import { IoMdClose } from "react-icons/io";

// To store photo on Cloudinary
import uploadFile from '../helpers/uploadfile';
import axios from 'axios';
import toast from 'react-hot-toast';
// To navigate to other pages
import { Link, useNavigate } from 'react-router-dom';
// For user-icon
import { HiUserCircle } from "react-icons/hi2";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "", 
  });

  const handleOnChange = (ele) => {
    const { name, value } = ele.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (ele) => {
    ele.preventDefault();
    ele.stopPropagation();

    const URL = `${import.meta.env.VITE_APP_BACKENED_URL}/api/email`;

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
      });
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: "", 
        });
        navigate("/password" , {
            state: response?.data.data
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='flex justify-start items-center font-bold text-2xl border rounded bg-zinc-200 p-2'>
            <HiUserCircle 
                size={50}
            />
        </div>
        <h1 className='font-bold text-red-400 mt-2'>Welcome to Chat App!</h1>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          {/* Email field */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email: </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-3 py-2 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-2xl px-5 py-1 rounded text-white font-semibold hover:bg-secondary'>
            Let's Go
          </button>
        </form>

        <p className='my-4 text-center'>
          New User? <Link to={"/register"} className='font-bold hover:text-primary cursor-pointer'>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default CheckEmailPage;
