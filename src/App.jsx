import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BugFollower from './components/BugFollower'
import CatFollower from './components/CatFollower'
import GatitoSeguidor from './components/GatitoSeguidor'
import catRunning from './assets/cat-running.gif'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>¡Mira cómo me sigue el gatito!</h1>
        <GatitoSeguidor imagenSrc={catRunning} />



        <CatFollower />
        <h3>¡¡¡TOCA AL GATITO!!!(Algo esconde)</h3>
        <BugFollower />
      </div>



    </>
  )
}

export default App
