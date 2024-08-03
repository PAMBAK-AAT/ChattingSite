

















import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Profile from './Profile';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../helpers/uploadfile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading'
import backImage from '../assets/wallapaper.jpeg';
import { IoSend } from "react-icons/io5";
import moment from 'moment'
import { useRef } from 'react';
import axios from 'axios' // import axios

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector( state => state?.user);

  const [dataUser, setDataUser] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id:   '',
  });

  // For images and video
  const [openImageVideoUpload , setOpenImageVideoUpload] = useState(false);
  const [message , setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : "",
  })

  const [loading,setLoading] = useState(false);
  const [allMessage , setAllMessage] = useState([]); 
  const currentMessage = useRef(null)

  useEffect( () => {
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({ behavior : 'smooth' , block : 'end'})
    }
  },[allMessage])

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload( prev => !prev);
  }

  const handleUploadImage = async (ele) => {
    const file = ele.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
     
    setMessage( prev => {
      return{
        ...prev,
        imageUrl : uploadPhoto.url
      }
    })
  }

  const handleCloseUploadImage =  () => {

    setMessage( prev => {
      return{
        ...prev,
        imageUrl : ""
      }
    })
  }

  const handleCloseUploadVideo =  () => {

    setMessage( prev => {
      return{
        ...prev,
        videoUrl : ""
      }
    })
  }

  const handleUploadVideo = async (ele) => {
    const file = ele.target.files[0];
    
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage( prev => {
      return{
        ...prev,
        videoUrl : uploadPhoto.url
      }
    })
  }

  /// Added part 
   // Fetch messages from server
   useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${params.userId}`);
        if (Array.isArray(response.data)) {
          setAllMessage(response.data);
        } else {
          console.error('Expected an array but got', response.data);
          setAllMessage([]);
        }
      } catch (error) {
        console.error('Error fetching messages', error);
        setAllMessage([]);
      }
    };
  
    fetchMessages();
  }, [params.userId]);
  


  // useEffect(() => {
  //   if (socketConnection) {
  //     socketConnection.emit('message-page', params.userId);

  //     socketConnection.emit('seen',params.userId);

  //     socketConnection.on('message-user', (data) => {
  //       setDataUser(data);
  //     });

  //     socketConnection.on('message' , (data) => {
  //       console.log('message data' , data);
  //       setAllMessage(data);
  //     })
  //   }
  // }, [socketConnection, params?.userId,user]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);
  
      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });
  
      socketConnection.on('message', (data) => {
        console.log('message data', data);
        if (Array.isArray(data)) {
          setAllMessage(data);
        } else {
          console.error('Expected an array but got', data);
          setAllMessage([]);
        }
      });
    }
  }, [socketConnection, params?.userId, user]);
  

  const handleOnChange = (ele) => {
    const { name , value } = ele.target;

    setMessage( prev => {
      return {
        ...prev,
        text : value
      }
    })
  }

  const handleSendMessage = (ele) =>{
    ele.preventDefault();

    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit('new message' , {
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
      }
      setMessage({
          text : "",
          imageUrl : "",
          videoUrl : "",
      })
    }
  }

  return (
      <div style={{ backgroundImage: `url(${backImage})` }} className=" bg-no-repeat bg-cover flex flex-col h-screen">
        <header className="sticky top-0 h-15 bg-white flex items-center justify-between shadow-md">
          <div className="flex items-center p-4">
            <Link to="/" className="lg:hidden hover:text-primary">
              <IoIosArrowBack size={30} />
            </Link>

            <div className='ml-3'>
              <Profile 
                width={50}
                height={60}
                imageUrl={dataUser?.profile_pic}
                name={dataUser?.name}
                userId={dataUser?._id}
              />
            </div>

            <div className='ml-4'>
              <h3 className='font-semibold text-xl -my-1 sm:text-md'>{dataUser?.name}</h3>
              <p classname='-my-2'>
                {
                  dataUser.online ? <span className='text-primary text-xl sm:text-md'>online</span> : <span className='text-slate-500 text-xl sm:text-md'>offline</span>
                }
              </p>
            </div>
          </div>

          <div className='px-4'>
            <button className='hover:text-primary'>
              <BsThreeDotsVertical size={28} />
            </button>
          </div>

        </header>
        {/* Show all messages */}
        <section className='h-[calc(100vh-160px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
                

            {/*  All messages  */}
            <div className="flex flex-col gap-2 p-4">
                {allMessage.map((msg, index) => (
                  <div
                    key={index}
                    ref={index === allMessage.length - 1 ? currentMessage : null}
                    className={`flex w-full ${
                      user._id === msg.msgByUserId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 m-2 rounded-lg shadow-md max-w-sm md:max-w-md lg:max-w-lg ${
                        user._id === msg.msgByUserId
                          ? "bg-blue-400 text-white ml-auto"
                          : "bg-slate-300 text-black mr-auto"
                      }`}
                    >
                      {msg?.imageUrl && (
                        <div className="w-full mb-2">
                          <img
                            src={msg?.imageUrl}
                            alt="Message content"
                            className="h-auto w-full object-contain"
                          />
                        </div>
                      )}
                      {msg?.videoUrl && (
                        <div className="w-full mb-2">
                          <video
                            controls
                            src={msg?.videoUrl}
                            className="h-auto w-full object-contain"
                          />
                        </div>
                      )}
                      <p className="text-lg">{msg.text}</p>
                      <p className="text-xs mt-1 text-right">
                        {moment(msg.createdAt).format("hh:mm A")}
                      </p>
                    </div>
                  </div>
                ))}
          </div>

            {/* Upload Image display */}
            {
                  message.imageUrl && (
                    <div className='sticky bottom-0 w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                      {/* For close this Image */}
                      <div className=' w-fit absolute top-0 right-0 p-3 cursor-pointer hover:text-red-500' onClick={handleCloseUploadImage}>
                        <IoClose size={30} />
                      </div>
                      <div className='bg-white p-3'>
                        <img 
                          src={message.imageUrl}
                          className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                          alt='uploadImage'
                        />
                      </div>
                    </div>
                  )
                }

                {/* Upload Video display */}
                {
                  message.videoUrl && (
                    <div className='sticky bottom-0 w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                      {/* For close this Image */}
                      <div className=' w-fit absolute top-0 right-0 p-3 cursor-pointer hover:text-red-500' onClick={handleCloseUploadVideo}>
                        <IoClose size={30} />
                      </div>
                      <div className='bg-white p-3'>
                        <video 
                          src={message.videoUrl}
                          className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                          controls
                          muted
                          autoPlay
                        />
                      </div>
                    </div>
                  )
                }
            {
              loading && (
                <div className='sticky bottom-0 w-full h-full flex justify-center items-center'>
                  <Loading />
                </div>
              )
            }

        </section>

        {/* Send Messages */}
        <section className='h-16 bg-white  flex items-center px-4'>
          <div className='relative'>
            <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
                <FaPlus size={20} />
            </button>
            
            {/* Video and Images section */}
            {
              openImageVideoUpload && (
                <div className='bg-white shadow rounded absolute bottom-16 w-40 p-2'>
                  <form>
                    {/* Images */}
                    <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer text-xl'>
                        <div className='text-primary'>
                            <FaImage size={20} />
                        </div>
                        <p>Image</p>
                    </label>
                    {/* Videos */}
                    <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer text-xl'>
                        <div className='text-purple-500'>
                            <FaVideo size={20} />
                        </div>
                        <p>Video</p>
                    </label>

                    <input 
                      type='file'
                      id='uploadImage'
                      onChange={handleUploadImage}
                      className='hidden'
                    />
                    <input 
                      type='file'
                      id='uploadVideo'
                      onChange={handleUploadVideo}
                      className='hidden'
                    />
                  </form>
                </div>
              )
            }
          </div>


          <form className='h-full w-[87vw] lg:w-[78vw] flex ' onSubmit={handleSendMessage}>
            {/* Input box */}
              <input 
                type='text'
                placeholder='Type message here...'
                className='py-1 px-7 outline-none w-full h-full text-gray-800 text-xl'
                value={message.text}
                onChange={handleOnChange}
              />
              <button className='text-primary hover:text-secondary'>
                  <IoSend size={30} />
              </button>
          </form>

        </section>
      </div>
      
  );
};

export default MessagePage;

