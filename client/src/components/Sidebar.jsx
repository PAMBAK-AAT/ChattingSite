




import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Profile from './Profile.jsx';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails.jsx';
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from './SearchUser.jsx';
import { FaImage, FaVideo } from "react-icons/fa";
import { logout, setSocketConnection } from '../redux/userSlice.jsx';

export const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            dispatch(setSocketConnection(storedUser.socketConnection));
        }

        if (socketConnection) {
            console.log('Connected to socket server');
            socketConnection.emit('sidebar', user?._id);

            socketConnection.on("conversation", (data) => {
                console.log('Received conversation data:', data);

                const conversationUserData = data.map((conversationUser, index) => {
                    if (conversationUser.sender?._id === user?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.receiver
                        };
                    } else {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        };
                    }
                });

                console.log('Processed conversationUserData:', conversationUserData);
                setAllUser(conversationUserData);
            });
        }
    }, [socketConnection, user]);

    const handleLogOut = () => {
        dispatch(logout());
        navigate("/email");
        localStorage.removeItem('user');
        localStorage.clear();
    };

    return (
        <div className='h-full flex'>
            <div className="bg-slate-100 w-16 h-full py-4 flex flex-col justify-between fixed z-10 shadow-lg">
                <div>
                    <NavLink to="/" className={({ isActive }) => `w-12 h-12 my-2 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full ${isActive && 'bg-slate-300'}`} title='chat'>
                        <IoChatbubbleEllipses size={30} />
                    </NavLink>

                    <div title="add friends" onClick={() => setOpenSearchUser(true)} className="w-12 h-12 my-2 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full">
                        <FaUserPlus size={30} />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <button className='m-3' title={user.name} onClick={() => setEditUserOpen(true)}>
                        <Profile
                            width={50}
                            height={70}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>

                    <button title="logout" className="w-10 h-10 my-2 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full" onClick={handleLogOut}>
                        <BiLogOut size={30} />
                    </button>
                </div>
            </div>

            <div className='w-full ml-16 relative z-20'>
                <div className='h-20 flex items-center'>
                    <h2 className='text-xl font-bold p-6 mt-5 text-slate-800'>Message</h2>
                </div>

                <div className='bg-slate-300 p-[0.6px]'></div>

                <div className='h-[calc(100vh-85px)] overflow-x-hidden overflow-y-auto'>
                    {allUser.length === 0 ? (
                        <div className='mt-12 p-3'>
                            <div className='flex justify-center items-center text-slate-500'>
                                <GoArrowUpLeft size={45} />
                            </div>
                            <p className='text-lg text-center font-semibold text-slate-500'>Explore users to start a conversation with.</p>
                        </div>
                    ) : (
                        allUser.map((conv, index) => (
                            <NavLink
                                to={"/" + conv?.userDetails?._id}
                                key={conv?._id}
                                className='flex items-center gap-4 p-4 border border-transparent hover:border-primary hover:bg-gray-100 rounded-lg transition-colors duration-300 ease-in-out shadow-lg'
                            >
                                <div className='flex-shrink-0'>
                                    <Profile
                                        imageUrl={conv?.userDetails?.profile_pic}
                                        name={conv?.userDetails?.name}
                                        height={60}
                                        width={60}
                                        userId={conv?.userDetails?._id}
                                        className='rounded-full border border-gray-300'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <h3 className='text-xl font-semibold text-gray-800 truncate'>{conv?.userDetails?.name}</h3>
                                    <div className='text-sm text-gray-500 flex items-center gap-2 mt-1'>
                                        <div className='flex items-center gap-2'>
                                            {conv?.lastMsg?.imageUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <FaImage className='text-gray-600' />
                                                    {!conv?.lastMsg?.text && <span>Image</span>}
                                                </div>
                                            )}
                                            {conv?.lastMsg?.videoUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <FaVideo className='text-gray-600' />
                                                    {!conv?.lastMsg?.text && <span>Video</span>}
                                                </div>
                                            )}
                                        </div>
                                        <p className='text-gray-700 truncate'>{conv?.lastMsg?.text}</p>
                                    </div>
                                </div>
                                {Boolean(conv?.unseenMsg) && (
                                    <p className='text-xs font-bold bg-primary text-white w-6 h-6 flex justify-center items-center rounded-full'>
                                        {conv?.unseenMsg}
                                    </p>
                                )}
                            </NavLink>
                        ))
                    )}
                </div>
            </div>

            {editUserOpen && <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />}
            {openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />}
        </div>
    );
};












// import React, { useEffect, useState } from 'react';
// import { IoChatbubbleEllipses } from "react-icons/io5";
// import { FaUserPlus } from "react-icons/fa";
// import { NavLink, useNavigate } from 'react-router-dom';
// import { BiLogOut } from "react-icons/bi";
// import Profile from './Profile.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// import EditUserDetails from './EditUserDetails.jsx';
// import { GoArrowUpLeft } from "react-icons/go";
// import SearchUser from './SearchUser.jsx';
// import { FaImage } from "react-icons/fa6";
// import { FaVideo } from "react-icons/fa";
// import { logout , setSocketConnection } from '../redux/userSlice.jsx';

// export const Sidebar = () => {
//     const user = useSelector(state => state?.user);
//     const [editUserOpen, setEditUserOpen] = useState(false); 
//     const [allUser, setAllUser] = useState([]);
//     const [openSearchUser, setOpenSearchUser] = useState(false);
//     const socketConnection = useSelector(state => state?.user?.socketConnection);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     useEffect(() => {

//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         if (storedUser) {
//             dispatch(setSocketConnection(storedUser.socketConnection));
//         }
        
//         if (socketConnection) {
//             console.log('Connected to socket server');
//             socketConnection.emit('sidebar', user?._id);
    
//             socketConnection.on("conversation", (data) => {
//                 console.log('Received conversation data:', data);
    
//                 const conversationUserData = data.map((conversationUser, index) => {
//                     if (conversationUser.sender?._id === user?._id) {
//                         return {
//                             ...conversationUser,
//                             userDetails: conversationUser.receiver
//                         };
//                     } else {
//                         return {
//                             ...conversationUser,
//                             userDetails: conversationUser.sender
//                         };
//                     }
//                 });
    
//                 console.log('Processed conversationUserData:', conversationUserData);
//                 setAllUser(conversationUserData);
//             });
//         }
//     }, [socketConnection, user]);
    
//     const handleLogOut = () => {
//         dispatch(logout())
//         navigate("/email");
//         localStorage.removeItem('user'); // Clear user data from localStorage
//         localStorage.clear();
//     }

//     return (
//         <div className='h-full flex'>
//             <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-tb-lg py-4 flex flex-col justify-between fixed z-10">
//                 <div>
//                     <NavLink to="/" className={({ isActive }) => `w-12 h-12 my-1 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && 'bg-slate-300'}`} title='chat'>
//                         <IoChatbubbleEllipses size={30} />
//                     </NavLink>

//                     <div title="add friends" onClick={() => setOpenSearchUser(true)} className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
//                         <FaUserPlus size={30} />
//                     </div>
//                 </div>

//                 <div className="flex flex-col items-center">
//                     <button className='mx-auto m-3' title={user.name} onClick={() => setEditUserOpen(true)}>
//                         <Profile
//                             width={50}
//                             height={70}
//                             name={user?.name}
//                             imageUrl={user?.profile_pic}
//                             userId={user?._id}
//                         />
//                     </button>

//                     <button title="logout" className="w-10 h-10 my-0 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded" onClick={handleLogOut}>
//                         <span className="-ml-3">
//                             <BiLogOut size={30} />
//                         </span>
//                     </button>
//                 </div>
//             </div>

//             <div className='w-full ml-[4vw] relative z-20'>
//                 <div className='h-20 flex items-center'>
//                     <h2 className='text-xl font-bold p-6 mt-5 text-slate-800'>Message</h2>
//                 </div>

//                 <div className='bg-slate-300 p-[0.6px]'></div>

//                 <div className='h-[calc(100vh-85px)] overflow-x-hidden overflow-y-auto scrollbar'>
//                     {
//                         allUser.length === 0 && (
//                             <div className='mt-12 p-3'>
//                                 <div className='flex justify-center items-center text-slate-500'>
//                                     <GoArrowUpLeft size={45} />
//                                 </div>
//                                 <p className='text-lg text-center font-semibold text-slate-500'>Explore users to start a conversation with.</p>
//                             </div>
//                         )
//                     }


//                     {
//                         allUser.map((conv, index) => {
//                             console.log('Rendering Profile with:', conv?.userDetails);
//                             return (
//                                 <NavLink
//                                     to={"/" + conv?.userDetails?._id}
//                                     key={conv?._id}
//                                     className='flex items-center gap-4 p-4 border border-transparent hover:border-primary hover:bg-gray-100 rounded-lg transition-colors duration-300 ease-in-out shadow-lg'
//                                 >
//                                     <div className='flex-shrink-0'>
//                                         <Profile
//                                             imageUrl={conv?.userDetails?.profile_pic}
//                                             name={conv?.userDetails?.name}
//                                             height={60}
//                                             width={60}
//                                             userId={conv?.userDetails?._id}
//                                             className='rounded-full border border-gray-300'
//                                         />
//                                     </div>
//                                     <div className='flex-1'>
//                                         <h3 className='text-xl font-semibold text-gray-800 truncate'>{conv?.userDetails?.name}</h3>
//                                         <div className='text-sm text-gray-500 flex items-center gap-2 mt-1'>
//                                             <div className='flex items-center gap-2'>
//                                                 {
//                                                     conv?.lastMsg?.imageUrl && (
//                                                         <div className='flex items-center gap-1'>
//                                                             <FaImage className='text-gray-600' />
//                                                             {!conv?.lastMsg?.text && <span>Image</span>}
//                                                         </div>
//                                                     )
//                                                 }
//                                                 {
//                                                     conv?.lastMsg?.videoUrl && (
//                                                         <div className='flex items-center gap-1'>
//                                                             <FaVideo className='text-gray-600' />
//                                                             {!conv?.lastMsg?.text && <span>Video</span>}
//                                                         </div>
//                                                     )
//                                                 }
//                                             </div>
//                                             <p className='text-gray-700 truncate'>{conv?.lastMsg?.text}</p>
//                                         </div>
//                                     </div>
//                                     {
//                                         Boolean(conv?.unseenMsg) && (
//                                             <p className='text-xs font-bold bg-primary text-white w-6 h-6 flex justify-center items-center rounded-full'>
//                                                 {conv?.unseenMsg}
//                                             </p>
//                                         )
//                                     }
//                                 </NavLink>
//                             );
//                         })
//                     }

//                 </div>
//             </div>

//             {
//                 editUserOpen && (
//                     <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
//                 )
//             }

//             {
//                 openSearchUser && (
//                     <SearchUser onClose={() => setOpenSearchUser(false)} />
//                 )
//             }
//         </div>
//     );
// };



