import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IoCloseSharp } from "react-icons/io5";

const SearchUser = ( {onClose} ) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_APP_BACKENED_URL}/api/searchUser`;
    setLoading(true);
    try { 
      const response = await axios.post(URL, { search });
      setSearchUser(response.data.data);

    } catch (error) {
      toast.error(error?.response?.data?.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      handleSearchUser();
    }
  }, [search]);

  console.log('searchUser' , searchUser)

  return (
    <div className='bg-slate-700 bg-opacity-40 p-10 fixed inset-0 flex flex-col items-center justify-start z-50'>
      <div className='w-full max-w-lg mt-24'>
        {/* Input search user */}
        <div className='bg-white rounded-full h-14 overflow-hidden flex shadow-lg'>
          <input 
            type='text'
            placeholder='Search user by name or email ...'
            className='w-full outline-none px-4 h-full text-lg rounded-l-full text-slate-800'
            onChange={(ele) => setSearch(ele.target.value)}
            value={search}
          />
          <div className='h-14 w-14 flex justify-center items-center text-slate-500'>
            <IoMdSearch size={30} />
          </div>
        </div>
      </div>

      {/* Display Search user */}
      <div className='bg-white mt-2 w-[70vw] p-4 rounded lg:w-[40vw] overflow-y-auto'>
        {/* No user found */}
        {
          searchUser.length === 0 && !loading && (
            <p className='text-center text-slate-500'>No user found!</p>
          )
        }

        {/* Loading state */}
        {
          loading && (
            <div className='text-center'>
              <Loading />
            </div>
          )
        }

        {/* If user found */}
        {
          searchUser.length !== 0 && !loading && (
            searchUser.map((user) => {
              return (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              );
            })
          )
        }
      </div>

      <div>
        <button className='absolute top-20 right-10 text-3xl p-4 lg:text-6 xl hover:text-white' onClick={onClose}>
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
