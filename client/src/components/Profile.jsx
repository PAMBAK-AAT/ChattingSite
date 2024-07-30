import React from 'react';
import { HiUserCircle } from 'react-icons/hi2';
import { useSelector } from 'react-redux';

const Profile = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector(state => state?.user?.onlineUser);

  let profileName = "";

  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      profileName = splitName[0][0] + splitName[1][0];
    } else {
      profileName = splitName[0][0];
    }
  }

  const bgColor = [
    'bg-slate-200',
    'bg-red-300',
    'bg-green-300',
    'bg-yellow-300',
    'bg-blue-300',
    'bg-sky-300',
    'bg-cyan-300',
    'bg-teal-300',
    'bg-gray-300'
  ];

  const randomNumber = Math.floor(Math.random() * 9);
  const isOnline = onlineUser.includes(userId);

  // Added debugging logs
  console.log('Profile Component Props:', { userId, name, imageUrl, width, height });
  console.log('Profile Name:', profileName);
  console.log('Is Online:', isOnline);

  return (
    <div 
      className="relative text-slate-800 rounded-full shadow border text-2xl font-bold" 
      style={{ width: width + "px", height: height + "px" }}
    >
      {
        imageUrl ? (
          <img 
            src={imageUrl}
            alt={name}
            className="rounded-full object-cover w-full h-full"
          />
        ) : (
          name ? (
            <div 
              className={`overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomNumber]}`} 
              style={{ width: width + "px", height: height + "px" }}
            >
              {profileName}
            </div>
          ) : (
            <HiUserCircle size={width} />
          )
        )
      }

      {
        isOnline && (
          <div className="bg-green-700 p-1 absolute bottom-1 -right-1 z-10 rounded-full"></div>
        )
      }
    </div>
  );
};

export default Profile;



