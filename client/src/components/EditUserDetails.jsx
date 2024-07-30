
import React, { useState, useEffect, useRef } from 'react';
import Profile from './Profile.jsx';
import uploadFile from '../helpers/uploadfile.jsx';
import Divider from './Divider.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice.jsx'

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || '',
    profile_pic: user?.profile_pic || ''
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      name: user?.name || '',
      profile_pic: user?.profile_pic || ''
    }));
  }, [user]);

  const handleOnChange = (ele) => {
    const { name, value } = ele.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPhoto = async (ele) => {
    const file = ele.target.files[0];
    if (file) {
      const uploadPhoto = await uploadFile(file);
      setData((prev) => ({
        ...prev,
        profile_pic: uploadPhoto?.url
      }));
    }
  };

  const handleOpenUpload = (ele) => {
    ele.preventDefault();
    ele.stopPropagation();
    uploadPhotoRef.current.click();
  };


  const handleSubmit = async (ele) => {
    ele.preventDefault();
    ele.stopPropagation();
    try {

        const URL = `${import.meta.env.VITE_APP_BACKENED_URL}/api/updateUser`;
        const response = await axios({
          method : 'post',
          data : data,
          url : URL,
          withCredentials : true
        })
        console.log('response' , response);
        toast.success(response.data.message);

      if(response.data.success){
        dispatch(setUser(response?.data?.data));
        onClose();
      }

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
};


  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border-0.5"
            />
          </div>

          <div>
            <div>Photo:</div>
            <div className="py-1 flex items-center gap-4">
              <Profile
                width={50}
                height={50}
                imageUrl={data.profile_pic}
                name={data.name}
              />
              <label htmlFor="profile_pic">
                <button
                  type="button"
                  onClick={handleOpenUpload}
                  className="font-semibold"
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />

          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="border-primary border text-primary hover:bg-primary hover:text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="border-primary bg-primary hover:bg-secondary text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);


