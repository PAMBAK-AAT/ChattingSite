

import React from 'react'
import Profile from './Profile'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user , onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className='cursor-pointer flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-primary rounded-lg'>
      <div>
        <Profile 
            width={50}
            height={50}
            name={user?.name}
            userId={user?._id}
            imageUrl={user?.profile_pic}
        />
      </div>
      <div>
        <div className='font-semibold text-ellipsis line-clamp-1'>
            {user?.name}
        </div>
        <p className='text-md text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard
