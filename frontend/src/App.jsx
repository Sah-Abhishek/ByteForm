import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* Hello world */}
    {/* <Signup/> */}
    <Login/>
    {/* <Home/> */}
    </>
  )
}

export default App
