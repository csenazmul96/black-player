import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from "./VideoPlayer.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <VideoPlayer />
    </>
  )
}

export default App
