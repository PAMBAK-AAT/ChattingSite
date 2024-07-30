

import React from 'react'
import logo from "../assets/logo.png"

const AuthLayout = ( {children} ) => {
  return (
    <>
       <header className='flex justify-center items-center py-4 h-30 shadow-lg bg-white'>

        <img src={logo} alt='App logo' width={200} height={70} />

       </header>

       { children }

    </>
  )
}

export default AuthLayout
