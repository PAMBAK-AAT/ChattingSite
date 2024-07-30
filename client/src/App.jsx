

import './index.css'
import { Outlet } from 'react-router-dom'
// Used for notification purpose
import toast, { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <Toaster /> 
        <main>
          <Outlet />
        </main>
    </>
  )
}

export default App

