import { useState } from 'react'
import './App.css'
import Login from './components/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Hello world */}
      {/* <Signup/> */}
      <Login />
      {/* <Home/> */}
    </>
  )
}

export default App
