import React from 'react'

// With the help of this hook , we can do any change in the state in these functional components , without hook it was done by class components.
import { useState } from 'react'

// React icons
import { IoMdClose } from "react-icons/io";

// To store photo on cloudinary
import uploadFile from '../helpers/uploadfile';

// axios: A library for making HTTP requests.
import axios from 'axios'

//For displaying notifications.
import toast from 'react-hot-toast' 

//  For navigating to other pages.
import { Link,useNavigate } from 'react-router-dom';


const RegisterPage = () => {

  // data: State object to hold the form data.
  // uploadPhoto: State to hold the uploaded photo file.

  const [data , setData] = useState({
    name: "",
    email: "", 
    password: "",
    profile_pic: "",

  })

  // Updates the form data state when input fields change.
  const handleOnChange = (ele) => {

    const {name , value} = ele.target;

    setData( (prev)  => {
      return{
        ...prev,
        [name] : value
      }
    })
  }

  
  const [uploadPhoto , setUploadPhoto] = useState("");
  const navigate = useNavigate();

  // Summary
  // File Selection: The user selects a file from their device.
  // File Upload: The selected file is uploaded to a cloud storage service using the uploadFile function.
  // State Update: The uploadPhoto state is updated with the selected file, and the data state is updated with the URL of the uploaded photo.
  const handleUploadPhoto = async (ele) => {
    const file = ele.target.files[0];
    // Here we upload image from cludinary
    const uploadPhoto = await uploadFile(file); 
    setUploadPhoto(file);

    setData( (prev) => {
      return{
        ...prev,
        profile_pic : uploadPhoto?.url
      }
    })

  }

  // console.log('upload photo'.uploadPhoto); // It gives all data of photo
  
  const handleDeletePhoto = (ele) => {
    ele.stopPropagation();
    ele.preventDefault();
    setUploadPhoto(null);
  }

  const handleSubmit = async (ele) => {

    //  preventDefault() prevents the default form submission behavior, which would typically reload the page.
    ele.preventDefault();
    ele.stopPropagation(); 
    // stopPropagation() prevents the event from bubbling up to parent elements. 
    // This ensures that only the click event on the delete button is handled 
    // and doesn't trigger any other click event listeners on parent elements.


    const URL = `${import.meta.env.VITE_APP_BACKENED_URL}/api/register`;

    // await axios.post(URL, data, { withCredentials: true }): Sends a POST request to the registration API 
    // with the form data (data). The withCredentials: true option is included to ensure cookies are sent 
    // with the request if needed (e.g., for session management).
      // response holds the response from the server.
      // toast.success(response.data.message): Displays a success message using react-hot-toast.
      // If the registration is successful (response.data.success), the form data state (data) is reset to its initial values (empty fields), and the user is navigated to the email verification page (navigate("/email")).
    try{
      const response = await axios.post(URL,data,{
        withCredentials: true,
      });
      console.log("Response",response.data);
      toast.success(response.data.message);

      if(response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        })
        navigate("/email")
      }
    }
    catch(err){
      toast.error(err?.response?.data?.message);
    }


    console.log("data",data);
  }


  return (
    <div  className='mt-5'>
      <div className='bg-white w-full max-w-md   rounded overflow-hidden p-4 mx-auto'>
        <h1>Welcome to Chat App!</h1>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          {/* Name field */}
          <div className='flex flex-col gap-1'>

            <label htmlFor='name'>Name : </label>
            <input type='text' id='name' name='name' placeholder='enter your name' className='bg-slate-100 px-3 py-2 focus: outline-primary '
            value={data.name}
            onChange={handleOnChange}
            required />

          </div>

          {/* Email field */}
          <div className='flex flex-col gap-1'>

            <label htmlFor='email'>Email : </label>
            <input type='email' id='email' name='email' placeholder='enter your email' className='bg-slate-100 px-3 py-2 focus: outline-primary '
            value={data.email}
            onChange={handleOnChange}
            required />

          </div>

          {/* Password field */}
          <div className='flex flex-col gap-1'>

            <label htmlFor='password'>Password : </label>
            <input type='password' id='password' name='password' placeholder='enter your password' className='bg-slate-100 px-3 py-2 focus: outline-primary '
            value={data.password}
            onChange={handleOnChange}
            required />

          </div>

          {/* Profile picture */}
          <div className='flex flex-col gap-1'>

            <label htmlFor='profile_pic'>Photo : 

              <div className='bg-slate-300 p-2 h-15 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>

                <p className='text-lg max-w-[300px]'>
                  {
                    uploadPhoto?.name ? uploadPhoto.name : "Upload profile photo"
                  }
                </p>
                {
                  uploadPhoto?.name && (
                    <button className='text-2xl ml-3 hover:text-red-700' onClick={handleDeletePhoto}>
                      <IoMdClose />
                    </button>
                  )
                }
              </div>

            </label>

            <input 
              type='file' 
              id='profile_pic' 
              name='profile_pic' 
              placeholder='enter your profile_pic' className='bg-slate-100 px-3 py-2 focus: outline-primary hidden'
              onChange={handleUploadPhoto}
            />

          </div>

          <button className='bg-primary text-2xl px-5 py-1 rounded text-white font-semibold hover:bg-secondary'>
            Register
          </button>

        </form>

        <p className='my-4 text-center'> Already have account ? <Link to={"/email"} className='font-bold hover:text-primary cursor-pointer'>Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage


//    Overall Flow:
  // The user fills out the registration form.
  // The form data is managed using the useState hook.
  // When the user uploads a profile picture, it is uploaded to Cloudinary, and the URL is stored in the form data.
  // When the form is submitted, the data is sent to the backend via an HTTP POST request.
  // If the registration is successful, the user is navigated to the email verification page.
  // If there is an error, a toast notification displays the error message.
